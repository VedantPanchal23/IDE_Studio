// src/components/Terminal.jsx
import React, { useEffect, useRef } from 'react'
import { Terminal as XTerminal } from 'xterm'
import 'xterm/css/xterm.css'

export default function Terminal({ initialText = '' }) {
  const containerRef = useRef(null)
  const termRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    // create terminal
    termRef.current = new XTerminal({ cols: 80, rows: 24, cursorBlink: true })
    termRef.current.open(containerRef.current)

    // initial content
    termRef.current.write(initialText || '\r\nWelcome to the embedded terminal\r\n$ ')

    // echo typed characters and show new prompt on Enter
    termRef.current.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        termRef.current.write('\r\n$ ')
      } else {
        // write characters normally (this is a simple stub; you can parse commands here)
        termRef.current.write(key)
      }
    })

    return () => {
      termRef.current && termRef.current.dispose()
    }
  }, [initialText])

  return <div ref={containerRef} style={{ width: '100%', height: '100%', padding: 6 }} />
}
