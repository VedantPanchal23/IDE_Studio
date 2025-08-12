// src/monacoTheme.js
export const registerVSCodeDarkPlus = (monaco) => {
  const theme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'D4D4D4', background: '1E1E2F' },
      { token: 'comment', foreground: '6A9955' },
      { token: 'keyword', foreground: '569CD6' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'type', foreground: '4EC9B0' }
    ],
    colors: {
      'editor.background': '#1E1E2F',
      'editor.foreground': '#D4D4D4',
      'editorLineNumber.foreground': '#858585',
      'editor.selectionBackground': '#264F78',
      'editorCursor.foreground': '#AEAFAD',
      'editorLineNumber.activeForeground': '#C6C6C6',
      'editorIndentGuide.background': '#2A2A3A',
      'editorIndentGuide.activeBackground': '#3A3A4A',
      'editorGroup.border': '#2a2a2a',
      'sideBar.background': '#252526',
      'sideBar.foreground': '#D4D4D4'
    }
  }

  try {
    monaco.editor.defineTheme('vscode-dark-plus-clone', theme)
  } catch (e) {
    // some envs may return an AMD monaco or wrapped instance; ignore if already defined
    console.warn('Could not define theme:', e)
  }
}
