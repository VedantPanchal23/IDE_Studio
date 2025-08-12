import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Home, Search, GitBranch, Settings, Terminal, FileText } from 'lucide-react'

export default function VSCodeLikeWebIDE(){
  const [files, setFiles] = useState([
    { id:1, name:'index.html', language:'html', content:'<h1>Hello</h1>' },
    { id:2, name:'app.js', language:'javascript', content:"console.log('hello')" },
    { id:3, name:'style.css', language:'css', content:'body{font-family:var(--editor-font)}' }
  ])
  const [openTabs, setOpenTabs] = useState([files[0]])
  const [activeFileId, setActiveFileId] = useState(files[0].id)
  const [showCommand, setShowCommand] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)

  useEffect(()=>{
    function onKey(e){
      if((e.ctrlKey || e.metaKey) && e.key === 'p'){
        e.preventDefault(); setShowCommand(s => !s)
      }
      if((e.ctrlKey || e.metaKey) && e.key === '`'){
        e.preventDefault(); // toggle terminal
        const t = document.getElementById('terminal');
        if(t) t.scrollIntoView({behavior:'smooth'})
      }
      if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p'){
        e.preventDefault(); setShowCommand(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[])

  const activeFile = files.find(f=>f.id===activeFileId) || openTabs[0]

  function openFile(file){
    if(!openTabs.find(t=>t.id===file.id)) setOpenTabs(s=>[...s,file])
    setActiveFileId(file.id)
  }

  function updateContent(id, newContent){
    setFiles(prev => prev.map(f => f.id===id ? {...f, content:newContent} : f))
  }

  return (
    <div className="h-screen w-screen bg-[var(--vscode-bg)] text-sm text-gray-200 vscode-like flex">
      <div className="flex flex-col items-center bg-[#0f1720] w-14 py-3 gap-3">
        <button className="p-2 rounded hover:bg-white/5"><Home size={18} /></button>
        <button className="p-2 rounded hover:bg-white/5"><Search size={18} /></button>
        <button className="p-2 rounded hover:bg-white/5"><GitBranch size={18} /></button>
        <button className="p-2 rounded hover:bg-white/5"><FileText size={18} /></button>
        <div className="mt-auto mb-2 border-t border-white/5 w-full flex justify-center pt-3">
          <button className="p-2 rounded hover:bg-white/5"><Settings size={16} /></button>
        </div>
      </div>

      <div className="flex flex-col bg-[var(--vscode-side)] w-64 border-r border-white/5">
        <div className="px-3 py-3 flex items-center gap-2 border-b border-white/3">
          <FileText size={16} />
          <span className="font-medium">Explorer</span>
        </div>
        <div className="p-2 overflow-auto flex-1">
          {files.map(file => (
            <div key={file.id} className={`p-2 rounded cursor-pointer hover:bg-white/5 flex items-center justify-between ${activeFileId===file.id ? 'bg-white/6': ''}`} onClick={()=>openFile(file)}>
              <div className="truncate">{file.name}</div>
              <div className="text-xs opacity-60">{file.language}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 bg-[#151823] px-3 border-b border-white/5 h-11">
          {openTabs.map(t=> (
            <div key={t.id} className={`px-3 py-1 rounded-t-md cursor-pointer ${activeFileId===t.id? 'bg-[#1e1e2f] border border-white/6' : 'hover:bg-white/3'}`} onClick={()=>setActiveFileId(t.id)}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{t.name}</span>
                <button className="ml-2 text-xs opacity-60" onClick={(e)=>{e.stopPropagation(); setOpenTabs(s=>s.filter(x=>x.id!==t.id)); if(activeFileId===t.id) setActiveFileId(openTabs[0]?.id)}}>x</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={activeFile?.language}
              language={activeFile?.language}
              value={activeFile?.content}
              theme={'vs-dark'}
              options={{
                minimap:{enabled:false},
                fontFamily:'var(--editor-font)',
                fontLigatures:true,
                fontSize:14,
                tabSize:2,
                automaticLayout:true
              }}
              onChange={(val)=>updateContent(activeFile.id, val||'')}
            />
          </div>

          <div className="w-80 bg-[#071018] border-l border-white/5 flex flex-col">
            <div className="p-3 flex items-center gap-2 border-b border-white/5">
              <Terminal size={16} />
              <span className="text-sm">Terminal</span>
            </div>
            <div id="terminal" className="p-3 text-xs opacity-70 flex-1">This panel will host xterm.js. (Terminal stub)</div>
          </div>
        </div>

        <div className="h-8 bg-[#0e1620] border-t border-white/5 flex items-center justify-between px-3 text-xs">
          <div className="flex items-center gap-4">
            <div>Ln 1, Col 1</div>
            <div>Spaces: 2</div>
            <div>UTF-8</div>
          </div>
          <div className="flex items-center gap-4 opacity-80">
            <div className="cursor-pointer" onClick={()=>setShowAIPanel(s=>!s)}>AI</div>
            <div className="cursor-pointer" onClick={()=>{ /* toggle theme stub */}}>Theme</div>
            <div className="cursor-pointer">Prettier</div>
          </div>
        </div>
      </div>

      {/* Command Palette Overlay */}
      {showCommand && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-20 bg-[#252537] w-2/3 rounded shadow-lg p-3 z-50">
          <input autoFocus placeholder="Type a command or file name... (Ctrl+P)" className="w-full bg-transparent outline-none text-white p-2" />
        </div>
      )}

      {/* AI Panel */}
      {showAIPanel && (
        <div className="absolute right-6 bottom-16 w-96 h-96 bg-[#0b0f12] border border-white/6 rounded-lg p-3 z-50">
          <div className="font-medium mb-2">AI Assistant</div>
          <div className="flex-1 text-xs opacity-70">Chat UI goes here. Add LLM integration to power suggestions, explainers, and code generation.</div>
        </div>
      )}
    </div>
  )
}