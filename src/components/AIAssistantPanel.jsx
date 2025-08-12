import React, { useState } from 'react';
import { Send, Code } from 'lucide-react';

export default function AIAssistantPanel({ onInsertCode, onClose }) {
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hello! I'm your AI assistant. How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const newMessages = [...messages, { from: 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI model.');
      }

      const data = await response.json();

      // A simple regex to extract code blocks from the response
      const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
      const matches = [...data.response.matchAll(codeRegex)];

      let lastIndex = 0;
      const responseMessages = [];

      for (const match of matches) {
        const language = match[1] || 'plaintext';
        const code = match[2];
        const textBefore = data.response.substring(lastIndex, match.index).trim();

        if (textBefore) {
          responseMessages.push({ from: 'ai', text: textBefore });
        }
        responseMessages.push({ from: 'ai', text: `Here is the ${language} code:`, code: code });
        lastIndex = match.index + match[0].length;
      }

      const textAfter = data.response.substring(lastIndex).trim();
      if (textAfter) {
          responseMessages.push({ from: 'ai', text: textAfter });
      }

      if(responseMessages.length === 0){
          // If no code blocks are found, treat the whole response as text.
          setMessages(prev => [...prev, { from: 'ai', text: data.response }]);
      } else {
          setMessages(prev => [...prev, ...responseMessages]);
      }


    } catch (error) {
      setMessages(prev => [...prev, { from: 'ai', text: `Sorry, something went wrong: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-4 bottom-14 w-[450px] h-[600px] bg-[#0b0f12] border border-white/10 rounded-lg flex flex-col shadow-2xl z-50">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <h3 className="font-semibold">AI Assistant</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg ${msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-[#252537]'}`}>
              <p className="text-sm">{msg.text}</p>
              {msg.code && (
                <div className="mt-2 p-2 bg-black/30 rounded">
                  <pre className="text-xs whitespace-pre-wrap font-mono">{msg.code}</pre>
                  <button
                    onClick={() => onInsertCode(msg.code)}
                    className="mt-2 flex items-center gap-2 text-xs px-2 py-1 rounded bg-blue-500/50 hover:bg-blue-500"
                  >
                    <Code size={14} />
                    Insert into Editor
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex flex-col items-start">
                <div className="max-w-[85%] p-3 rounded-lg bg-[#252537]">
                    <p className="text-sm animate-pulse">AI is thinking...</p>
                </div>
            </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask the AI for help..."
          className="flex-1 bg-[#252537] text-white rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
