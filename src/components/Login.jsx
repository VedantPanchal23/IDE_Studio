import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase';

export default function Login({ setUser }) {

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0b0f12]">
      <div className="p-8 bg-[#1e1e2f] rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Welcome to the AI Web IDE</h1>
        <p className="text-gray-400 mb-8">Please sign in to continue</p>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
