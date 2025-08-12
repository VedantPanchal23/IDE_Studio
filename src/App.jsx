import React from 'react';
import VSCodeLikeWebIDE from "./components/VSCodeLikeWebIDE";
import './styles/tailwind.css';

export default function App() {
  return (
    <React.StrictMode>
      <VSCodeLikeWebIDE />
    </React.StrictMode>
  );
}