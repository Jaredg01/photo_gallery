"use client";


import Gallery from "../components/gallery";
import UploadImage from "../components/upload-image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const router = useRouter();

  // Fetch uploaded images
  const refreshUploads = async () => {
    try {
      const res = await fetch('/api/uploads');
      if (!res.ok) return;
      const files = await res.json();
      setUploadedImages(files.map(f => `/uploads/${encodeURIComponent(f)}`));
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    refreshUploads();
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    // router.push('/home') will be handled by useEffect below
  };
  // Redirect to / after logout, but only when authLoading is false
  useEffect(() => {
    if (!authLoading && user === null) {
      router.push('/');
    }
  }, [authLoading, user, router]);

  // Default stock images (same as Gallery.js)
  const defaultImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101053361-7630a1c470df?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101178521-1e1ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-1e1ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101178521-2e2ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-2e2ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101178521-3e3ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-3e3ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101178521-4e4ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-4e4ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101178521-5e5ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-5e5ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101178521-6e6ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-6e6ec7a1c7b8?auto=format&fit=crop&w=400&q=80',
    'https://picsum.photos/id/1011/400/300',
    'https://picsum.photos/id/1012/400/300',
    'https://picsum.photos/id/1013/400/300',
    'https://picsum.photos/id/1015/400/300',
    'https://picsum.photos/id/1016/400/300',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200">
  <header className="py-10 px-8 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 shadow-lg rounded-b-3xl border-b-4 border-blue-500 flex flex-col items-center justify-center relative">
    <div className="flex flex-col items-center justify-center w-full">
      <h1 style={{
        fontFamily: "'Pacifico', cursive, 'Brush Script MT', sans-serif",
        fontSize: '2.8rem',
        fontWeight: 900,
        color: '#fff',
        textShadow: '0 4px 24px rgba(60,64,67,0.18)',
        letterSpacing: '0.04em',
        marginBottom: '0.5rem',
        lineHeight: 1.1,
        textAlign: 'center',
      }}>Photo Gallery</h1>
      <p className="text-lg text-white/90 font-medium drop-shadow text-center mt-5">Upload and view your favorite images</p>
    </div>
    {user && (
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
        <span
          className="font-semibold text-white text-lg cursor-pointer hover:underline drop-shadow"
          onClick={() => router.push('/profile')}
        >
          {user.displayName || user.email}
        </span>
        <span
          className="cursor-pointer"
          onClick={() => router.push('/profile')}
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover aspect-square" />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="w-12 h-12 rounded-full border-2 border-white bg-white/20 shadow-lg">
              <circle cx="12" cy="12" r="12" fill="#e0e7ef" />
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#6366f1" />
            </svg>
          )}
        </span>
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg cursor-pointer"
        >
          Log out
        </button>
      </div>
    )}
  </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-black w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-8">
          <UploadImage refreshUploads={refreshUploads} />
        </div>
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
          <Gallery
            uploadedImages={uploadedImages}
            refreshUploads={refreshUploads}
            defaultImages={defaultImages}
          />
        </div>
      </main>
  <footer className="py-6 text-center text-base font-semibold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-white shadow-inner rounded-t-3xl border-t-4 border-blue-500 tracking-wide drop-shadow-lg" style={{fontFamily: "'Pacifico', cursive, 'Brush Script MT', sans-serif"}}>
  <span style={{fontFamily: "'Pacifico', cursive, 'Brush Script MT', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em'}}>© Photo Gallery</span>
      </footer>
    </div>
  );
}

