import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import monacoTheme from "../monacoTheme"; // your custom theme file

export default function EditorPanel() {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [code, setCode] = useState(`// Welcome to Your AI-Powered Web IDE
function greet() {
  console.log("Hello, world!");
}
greet();`);

  useEffect(() => {
    if (containerRef.current) {
      // Register custom theme
      monaco.editor.defineTheme("customTheme", monacoTheme);

      // Create editor
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code,
        language: "javascript",
        theme: "customTheme",
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: true },
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        roundedSelection: true,
        cursorBlinking: "smooth",
        padding: { top: 16 },
      });

      // Listen for changes
      editorRef.current.onDidChangeModelContent(() => {
        setCode(editorRef.current.getValue());
      });
    }

    return () => editorRef.current?.dispose();
  }, []);

  return (
    <div
      className="w-full h-screen bg-[#1e1e1e] flex items-center justify-center p-4"
    >
      <div
        className="w-full h-full rounded-2xl shadow-2xl overflow-hidden 
                   transform transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]"
      >
        {/* Animated editor container */}
        <div
          ref={containerRef}
          className="w-full h-full border border-gray-700"
          style={{
            animation: "fadeSlideIn 0.6s ease-out",
          }}
        />
      </div>

      {/* Custom animations */}
      <style>
        {`
          @keyframes fadeSlideIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
