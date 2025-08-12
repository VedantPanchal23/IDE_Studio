import React, { useState, useEffect } from 'react';
import VSCodeLikeWebIDE from "./components/VSCodeLikeWebIDE";
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './styles/tailwind.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#0b0f12]">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <React.StrictMode>
      {user ? <VSCodeLikeWebIDE user={user} /> : <Login setUser={setUser} />}
    </React.StrictMode>
  );
}