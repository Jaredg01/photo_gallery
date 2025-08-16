"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';


export default function Home() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/home');
    }
  }, [authLoading, user, router]);


  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // router.push('/home-page'); // Not needed, handled by onAuthStateChanged
    } catch (err) {
      setError('Google login failed');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // router.push('/home-page'); // Not needed, handled by onAuthStateChanged
    } catch (err) {
      setError(err.message || 'Email login failed');
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200">
      <header className="py-10 px-8 text-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 shadow-lg rounded-b-3xl border-b-4 border-blue-500">
        <h1 style={{
          fontFamily: "'Pacifico', cursive, 'Comic Sans MS', 'Brush Script MT', sans-serif",
          fontSize: '2.8rem',
          fontWeight: 900,
          color: '#fff',
          textShadow: '0 4px 24px rgba(60,64,67,0.18)',
          letterSpacing: '0.04em',
          marginBottom: '0.5rem',
          lineHeight: 1.1,
        }}>Photo Gallery</h1>
        <p className="text-lg text-white/90 font-medium drop-shadow">Please log in to continue</p>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
        <form onSubmit={handleEmailLogin} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4 w-full max-w-sm">
          <label className="font-semibold text-gray-700 mb-1" htmlFor="email-input">Email</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded px-3 py-2 text-gray-900"
            style={{ color: '#1a1a1a' }}
            required
          />
          <label className="font-semibold text-gray-700 mb-1 mt-2" htmlFor="password-input">Password</label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded px-3 py-2 text-lg font-bold tracking-widest text-gray-900"
            style={{ WebkitTextSecurity: 'disc', color: '#1a1a1a' }}
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            {isRegister ? 'Register' : 'Log in'}
          </button>
          <button
            type="button"
            className="text-blue-600 underline text-sm mt-2 cursor-pointer"
            onClick={() => setIsRegister(r => !r)}
          >
            {isRegister ? 'Already have an account? Log in' : "Don't have an account? Register"}
          </button>
        </form>
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-500">or</span>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-lg text-lg shadow cursor-pointer transition-colors duration-150"
            style={{ boxShadow: '0 2px 8px rgba(60,64,67,.08)' }}
          >
            <svg width="24" height="24" viewBox="0 0 48 48" className="inline-block" style={{ display: 'inline', verticalAlign: 'middle' }}>
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.53 7.82 2.81l5.77-5.77C33.64 3.36 29.28 1.5 24 1.5 14.82 1.5 6.98 7.5 3.67 15.09l6.91 5.37C12.2 14.09 17.62 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.04h12.42c-.54 2.9-2.18 5.36-4.66 7.04l7.19 5.6C43.98 37.09 46.1 31.27 46.1 24.5z"/>
                <path fill="#FBBC05" d="M10.58 28.46A14.5 14.5 0 0 1 9.5 24c0-1.56.27-3.07.75-4.46l-6.91-5.37A23.93 23.93 0 0 0 0 24c0 3.91.94 7.61 2.59 10.83l7.99-6.37z"/>
                <path fill="#EA4335" d="M24 46.5c6.48 0 11.92-2.14 15.89-5.83l-7.19-5.6c-2 1.41-4.56 2.25-8.7 2.25-6.38 0-11.8-4.59-13.42-10.71l-7.99 6.37C6.98 40.5 14.82 46.5 24 46.5z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            <span>Log in with Google</span>
          </button>
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </main>
      <footer className="py-6 text-center text-base font-semibold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-white shadow-inner rounded-t-3xl border-t-4 border-blue-500 tracking-wide drop-shadow-lg">
        <span style={{fontFamily: "'Pacifico', cursive, 'Comic Sans MS', 'Brush Script MT', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em'}}>© 2025 Photo Gallery</span>
      </footer>
    </div>
  );
}
