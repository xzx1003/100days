'use client'

import { forwardRef } from 'react'

const leftImages = [
  'https://images.unsplash.com/photo-1718838541476-d04e71caa347?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1715432362539-6ab2ab480db2?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1718601980986-0ce75101d52d?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1685904042960-66242a0ac352?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1719411182379-ffd97c1f7ebf?w=900&auto=format&fit=crop',
]

const centerImages = [
  'https://images.unsplash.com/photo-1718969604981-de826f44ce15?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476180814856-a36609db0493?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595407660626-db35dcd16609?w=900&auto=format&fit=crop',
]

const rightImages = [
  'https://images.unsplash.com/photo-1719547907790-f661a88302c2?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599054799131-4b09c73a63cf?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1719963532023-01b573d1d584?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1714328101501-3594de6cb80f?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1719554873571-0fd6bf322bb1?w=900&auto=format&fit=crop',
]

function ImageColumn({ images }: { images: string[] }) {
  return (
    <div className="grid gap-2">
      {images.map((src) => (
        <figure className="w-full overflow-hidden rounded-md" key={src}>
          <img
            src={src}
            alt=""
            className="h-96 w-full rounded-md object-cover align-bottom transition duration-300 hover:scale-[1.025]"
          />
        </figure>
      ))}
    </div>
  )
}

const StickyScroll = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section className="sticky-scroll-demo bg-black" ref={ref}>
      <div className="wrapper">
        <section className="sticky top-0 grid h-screen w-full place-content-center bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <h1 className="px-8 text-center text-5xl font-semibold leading-[120%] tracking-tight 2xl:text-7xl">
            Build a gallery like a memory wall
            <br />
            with sticky columns and smooth scroll
            <br />
            Keep going
          </h1>
        </section>
      </div>

      <section className="w-full bg-slate-950 text-white">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <ImageColumn images={leftImages} />
          </div>
          <div className="sticky top-0 col-span-4 grid h-screen w-full grid-rows-3 gap-2">
            {centerImages.map((src) => (
              <figure className="h-full w-full overflow-hidden rounded-md" key={src}>
                <img
                  src={src}
                  alt=""
                  className="h-full w-full rounded-md object-cover align-bottom transition duration-300 hover:scale-[1.025]"
                />
              </figure>
            ))}
          </div>
          <div className="col-span-4">
            <ImageColumn images={rightImages} />
          </div>
        </div>
      </section>

      <footer className="group bg-slate-950">
        <h1 className="translate-y-20 bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-center text-[16vw] font-semibold uppercase leading-[100%] text-transparent transition-all ease-linear">
          memory-layout
        </h1>
        <div className="relative z-10 grid h-40 place-content-center rounded-tl-full rounded-tr-full bg-black text-2xl" />
      </footer>
    </section>
  )
})

StickyScroll.displayName = 'StickyScroll'

export default StickyScroll
