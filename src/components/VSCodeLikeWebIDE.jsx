import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import Terminal from "./Terminal";
import { Home, Search, GitBranch, Settings, Terminal as TerminalIcon, FileText, FilePlus, Download, Play, Split } from 'lucide-react'
import { registerVSCodeDarkPlus } from "../monacoTheme";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import localforage from "localforage";
import JSZip from 'jszip';
import AIAssistantPanel from './AIAssistantPanel';
import { auth } from '../firebase';
import FileIcon from './FileIcon';
import Fuse from 'fuse.js';

const initialFiles = [
  { id:1, name:'index.html', language:'html', content:'<h1>Hello</h1>' },
  { id:2, name:'app.js', language:'javascript', content:"console.log('hello')" },
  { id:3, name:'style.css', language:'css', content:'body{font-family:var(--editor-font)}' }
];

export default function VSCodeLikeWebIDE({ user }){
  const [files, setFiles] = useState([])
  const [openTabs, setOpenTabs] = useState([])
  const [activeFileId, setActiveFileId] = useState(null)
  const [showCommand, setShowCommand] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [commandQuery, setCommandQuery] = useState('');
  const [commandResults, setCommandResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [splitView, setSplitView] = useState(false);
  const [rightPanelFileId, setRightPanelFileId] = useState(null);
  const [activePanel, setActivePanel] = useState('left');

  useEffect(() => {
    // Load files from localforage on initial render
    localforage.getItem('files').then(savedFiles => {
      if (savedFiles && savedFiles.length > 0) {
        setFiles(savedFiles);
        setActiveFileId(savedFiles[0].id);
        setOpenTabs([savedFiles[0]]);
      } else {
        // If no files are saved, load initial files
        setFiles(initialFiles);
        setActiveFileId(initialFiles[0].id);
        setOpenTabs([initialFiles[0]]);
        localforage.setItem('files', initialFiles);
      }
    });
  }, []);

  useEffect(() => {
    // Save files to localforage whenever they change
    if (files.length > 0) {
      localforage.setItem('files', files);
      setFuse(new Fuse(files, { keys: ['name'] }));
    }
  }, [files]);

  useEffect(() => {
    if (commandQuery && fuse) {
      const results = fuse.search(commandQuery);
      setCommandResults(results.map(result => result.item));
    } else {
      setCommandResults(files); // Show all files if query is empty
    }
  }, [commandQuery, fuse, files]);

  useEffect(()=>{
    function onKey(e){
      if((e.ctrlKey || e.metaKey) && e.key === 'p'){
        e.preventDefault();
        setShowCommand(s => !s);
        if (!showCommand) {
          setCommandQuery(''); // Reset query when opening
        }
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
  },[showCommand])

  useEffect(() => {
    if (splitView && !rightPanelFileId) {
      const nextFile = openTabs.find(t => t.id !== activeFileId) || openTabs[0];
      if (nextFile) {
        setRightPanelFileId(nextFile.id);
      }
    }
    if (!splitView) {
      setRightPanelFileId(null);
    }
  }, [splitView, openTabs, activeFileId, rightPanelFileId]);

  const activeFile = files.find(f=>f.id===activeFileId);
  const rightPanelFile = files.find(f => f.id === rightPanelFileId);

  function openFile(file, panel = activePanel){
    if(!openTabs.find(t=>t.id===file.id)) setOpenTabs(s=>[...s,file])

    if(panel === 'left'){
        setActiveFileId(file.id);
    } else {
        setRightPanelFileId(file.id);
        if(!splitView) setSplitView(true);
    }
  }

  function updateContent(id, newContent){
    setFiles(prev => prev.map(f => f.id===id ? {...f, content:newContent} : f))
  }

  function createNewFile() {
    const fileName = prompt("Enter file name:");
    if (fileName) {
      const newFile = {
        id: Date.now(),
        name: fileName,
        language: 'plaintext',
        content: ''
      };
      setFiles(prev => [...prev, newFile]);
      openFile(newFile);
    }
  }

  async function downloadProjectAsZip() {
    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.name, file.content);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleInsertCode(codeToInsert) {
    if (activeFileId) {
      const currentFile = files.find(f => f.id === activeFileId);
      if (currentFile) {
        const newContent = currentFile.content + '\n' + codeToInsert;
        updateContent(activeFileId, newContent);
      }
    }
  }

  const handleLogout = () => {
    auth.signOut();
  };

  const handleRunCode = async () => {
    if (!activeFile) return;
    setTerminalOutput(`Running ${activeFile.name}...`);
    try {
      const response = await fetch('http://localhost:3001/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeFile.language,
          code: activeFile.content,
        }),
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();
      setTerminalOutput(data.output);
    } catch (error) {
      setTerminalOutput(`Error: ${error.message}`);
    }
  };

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

      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={15} minSize={10} className="flex flex-col bg-[var(--vscode-side)] min-w-[200px]">
          <div className="px-3 py-3 flex items-center justify-between border-b border-white/3">
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span className="font-medium">Explorer</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={downloadProjectAsZip} className="p-1 rounded hover:bg-white/10">
                <Download size={16} />
              </button>
              <button onClick={createNewFile} className="p-1 rounded hover:bg-white/10">
                <FilePlus size={16} />
              </button>
            </div>
          </div>
          <div className="p-2 overflow-auto flex-1">
            {files.map(file => (
              <div key={file.id} className={`p-2 rounded cursor-pointer hover:bg-white/5 flex items-center justify-between ${activeFileId===file.id ? 'bg-white/10': ''}`} onClick={()=>openFile(file)}>
                <div className="flex items-center">
                  <FileIcon fileName={file.name} />
                  <span className="truncate">{file.name}</span>
                </div>
                <div className="text-xs opacity-60 pr-2">{file.language}</div>
              </div>
            ))}
          </div>
        </Panel>
        <PanelResizeHandle className="w-[2px] bg-[#ffffff10] hover:bg-[#ffffff20] transition-colors" />
        <Panel minSize={30} className="flex-1 flex flex-col">
          <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={20} className="flex flex-col">
              <div className="flex items-center justify-between bg-[#151823] border-b border-white/5 h-11 pr-4">
                <div className="flex items-center">
                  {openTabs.map(t=> (
                    <div key={t.id} className={`px-3 h-full flex items-center cursor-pointer border-r border-transparent transition-colors duration-200 ${activeFileId===t.id? 'bg-[var(--editor-bg)] border-b-2 border-blue-400' : 'bg-[#2d2d2d] hover:bg-[#3d3d3d]'}`} onClick={()=>setActiveFileId(t.id)}>
                      <div className="flex items-center gap-2">
                        <FileIcon fileName={t.name} />
                        <span className="font-medium text-sm">{t.name}</span>
                        <button className="ml-2 text-xs opacity-60 hover:bg-white/20 rounded p-1" onClick={(e)=>{e.stopPropagation(); setOpenTabs(s=>s.filter(x=>x.id!==t.id)); if(activeFileId===t.id) setActiveFileId(openTabs[0]?.id)}}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSplitView(s => !s)} className="p-1.5 rounded hover:bg-white/10">
                    <Split size={16} />
                  </button>
                  <button onClick={handleRunCode} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                    <Play size={16} />
                    Run
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden editor-glow">
                <PanelGroup direction="horizontal">
                  <Panel>
                    <div onFocus={() => setActivePanel('left')} className="h-full">
                      <Editor
                        height="100%"
                        defaultLanguage={activeFile?.language}
                        language={activeFile?.language}
                        value={activeFile?.content || ''}
                        theme={'vscode-dark-plus-clone'}
                        beforeMount={registerVSCodeDarkPlus}
                        options={{ minimap: { enabled: true }, fontFamily: 'var(--editor-font)', fontLigatures: true, fontSize: 14, tabSize: 2, automaticLayout: true }}
                        onChange={(val) => activeFile && updateContent(activeFile.id, val || '')}
                      />
                    </div>
                  </Panel>
                  {splitView && (
                    <>
                      <PanelResizeHandle className="w-[2px] bg-[#ffffff10] hover:bg-[#ffffff20] transition-colors" />
                      <Panel>
                        <div onFocus={() => setActivePanel('right')} className="h-full">
                          {rightPanelFile ? (
                            <Editor
                              height="100%"
                              defaultLanguage={rightPanelFile?.language}
                              language={rightPanelFile?.language}
                              value={rightPanelFile?.content || ''}
                              theme={'vscode-dark-plus-clone'}
                              beforeMount={registerVSCodeDarkPlus}
                              options={{ minimap: { enabled: true }, fontFamily: 'var(--editor-font)', fontLigatures: true, fontSize: 14, tabSize: 2, automaticLayout: true }}
                              onChange={(val) => rightPanelFile && updateContent(rightPanelFile.id, val || '')}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              Select a file to open in this panel.
                            </div>
                          )}
                        </div>
                      </Panel>
                    </>
                  )}
                </PanelGroup>
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
                  <div className="flex items-center gap-2">
                    <span>{user.displayName || 'User'}</span>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button>
                  </div>
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="h-[2px] bg-[#ffffff10] hover:bg-[#ffffff20] transition-colors" />
            <Panel defaultSize={30} minSize={10} className="flex flex.col">
              <div className="bg-[#071018] border-t border-white/5 flex flex-col h-full">
                <div className="p-3 flex items-center gap-2 border-b border-white/5">
                  <TerminalIcon size={16} />
                  <span className="text-sm">Terminal</span>
                </div>
                <div id="terminal" className="flex-1 w-full h-full overflow-hidden">
                    <Terminal output={terminalOutput} />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>

      {/* Command Palette Overlay */}
      {showCommand && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50 z-40"
          onClick={() => setShowCommand(false)}
        >
          <div
            className="absolute left-1/2 transform -translate-x-1/2 top-20 bg-[#252537] w-1/2 max-w-2xl rounded-lg shadow-lg z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              placeholder="Type a command or file name... (Ctrl+P)"
              className="w-full bg-transparent outline-none text-white p-4 text-lg border-b border-white/10"
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
            />
            <div className="max-h-96 overflow-y-auto">
              {commandResults.map(file => (
                <div
                  key={file.id}
                  className="p-3 hover:bg-blue-500/30 cursor-pointer flex items-center"
                  onClick={() => {
                    openFile(file);
                    setShowCommand(false);
                  }}
                >
                  <FileIcon fileName={file.name} />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Panel */}
      {showAIPanel && (
        <AIAssistantPanel
          onClose={() => setShowAIPanel(false)}
          onInsertCode={handleInsertCode}
        />
      )}
    </div>
  )
}