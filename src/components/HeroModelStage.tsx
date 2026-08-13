import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Group } from 'three'

const modelPath = '/models/anniversary-model.glb'
const modelTargetTilt = {
  x: 0,
  y: 0,
}

function AnniversaryModel() {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(modelPath)
  const { scale, offsetY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z)
    const fitScale = maxDimension > 0 ? 3.15 / maxDimension : 1

    return {
      scale: fitScale,
      offsetY: -center.y * fitScale,
    }
  }, [scene])

  useFrame(({ clock: _clock }) => {
    if (!groupRef.current) return

    groupRef.current.rotation.y += (modelTargetTilt.y - groupRef.current.rotation.y) * 0.08
    groupRef.current.rotation.x += (modelTargetTilt.x - groupRef.current.rotation.x) * 0.08
    groupRef.current.position.y += (offsetY - groupRef.current.position.y) * 0.08
  })

  return (
    <group ref={groupRef} position={[0, offsetY, 0]} rotation={[0, 0, 0]} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

function HeroModelStage() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const handleMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      modelTargetTilt.x = py * -0.08
      modelTargetTilt.y = px * 0.12
      stage.style.setProperty('--stage-rx', `${py * -2}deg`)
      stage.style.setProperty('--stage-ry', `${px * 3}deg`)
      stage.style.setProperty('--stage-scale', '1.02')
    }

    const handleLeave = () => {
      modelTargetTilt.x = 0
      modelTargetTilt.y = 0
      stage.style.setProperty('--stage-rx', '0deg')
      stage.style.setProperty('--stage-ry', '0deg')
      stage.style.setProperty('--stage-scale', '1')
    }

    stage.addEventListener('pointermove', handleMove)
    stage.addEventListener('pointerleave', handleLeave)

    return () => {
      stage.removeEventListener('pointermove', handleMove)
      stage.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  return (
    <div ref={stageRef} className="hero-model-stage" aria-label="3D模型展示">
      <Canvas
        camera={{ position: [0, 0.02, 4.6], fov: 27 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.02} />
        <directionalLight position={[2, 2.5, 3]} intensity={0.75} />
        <Suspense fallback={null}>
          <AnniversaryModel />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HeroModelStage
