import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from 'xterm';
import 'xterm/css/xterm.css';

export default function Terminal({ output }) {
  const containerRef = useRef(null);
  const termRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !termRef.current) {
      termRef.current = new XTerminal({
        cursorBlink: true,
        convertEol: true,
        rows: 24,
      });
      termRef.current.open(containerRef.current);
      termRef.current.writeln('Welcome to the terminal!');
      termRef.current.writeln('Click the "Run" button to execute your code.');
      termRef.current.writeln('');
    }

    return () => {
        // No need to dispose here as it's handled in the main component
    };
  }, []);

  useEffect(() => {
    if (termRef.current && output) {
      // Clear the terminal and write the new output
      termRef.current.clear();
      termRef.current.writeln(`> Executing code...`);
      termRef.current.writeln(output.replace(/\n/g, '\r\n'));
      termRef.current.writeln('');
    }
  }, [output]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', padding: 8, background: '#071018' }} />;
}
