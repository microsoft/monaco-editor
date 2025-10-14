import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useEffect, useRef } from 'react'

import styles from './Editor.module.css'

export function Editor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    editorRef.current = monaco.editor.create(
      containerRef.current,
      {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'typescript',
      },
    )

    return editorRef.current.dispose.bind(editorRef.current)
  }, [])

  return <div ref={containerRef} className={styles.Editor} />
}