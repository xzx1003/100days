import { useCallback, useRef, useState } from 'react'

function AnimatedEditorBackground() {
  return (
    <div className="editor-animated-bg" aria-hidden="true">
      <div className="editor-bg-gradient" />
      <div className="editor-aurora-orb editor-aurora-orb-1" />
      <div className="editor-aurora-orb editor-aurora-orb-2" />
      <div className="editor-aurora-orb editor-aurora-orb-3" />
      <div className="editor-aurora-orb editor-aurora-orb-4" />
      <div className="editor-bg-crossfade">
        <span />
        <span />
      </div>
      <div className="editor-bg-noise" />
    </div>
  )
}

function RichTextEditorPage() {
  const [_content, setContent] = useState('')
  const [opened, setOpened] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
    }
  }, [])

  return (
    <div className={`rich-editor-page ${opened ? 'is-opened' : ''}`}>
      <AnimatedEditorBackground />

      <div className="letter-envelope-stage" aria-hidden={opened ? 'true' : undefined}>
        <div className="letter-envelope">
          <div className="letter-envelope-paper" />
          <div className="letter-envelope-flap" />
          <button className="letter-wax-seal" type="button" onClick={() => setOpened(true)} aria-label="打开信封">
            <span />
          </button>
        </div>
      </div>

      <div className="rich-editor-card">
        <div className="rich-editor-card-aurora" />
        <div className="rich-editor-card-gloss" />

        <div
          ref={editorRef}
          className="rich-editor-surface"
          contentEditable
          data-placeholder="in progress"
          suppressContentEditableWarning
          onInput={handleInput}
        />
      </div>
    </div>
  )
}

export default RichTextEditorPage
