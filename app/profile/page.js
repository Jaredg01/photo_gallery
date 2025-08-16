"use client";

import { useEffect, useState, useRef } from "react";
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';



export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPicModal, setShowPicModal] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setDisplayName(u.displayName || "");
        // Try to split displayName into first/last if possible
        if (u.displayName && u.displayName.includes(" ")) {
          const [first, ...rest] = u.displayName.split(" ");
          setFirstName(first);
          setLastName(rest.join(" "));
        } else {
          setFirstName("");
          setLastName("");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const newDisplayName = `${firstName} ${lastName}`.trim() || displayName;
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      setSuccess("Profile updated!");
    } catch (err) {
      setError("Failed to update profile");
    }
    setSaving(false);
  };

  // Show both uploaded images and default images as profile picture options
  const defaultImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80',
  ];
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    async function fetchUploads() {
      let uploaded = [];
      try {
        const res = await fetch('/api/uploads');
        if (res.ok) {
          const files = await res.json();
          uploaded = files.map(f => `/uploads/${encodeURIComponent(f)}`);
        }
      } catch (e) {
        // ignore
      }
      setGalleryImages([...uploaded, ...defaultImages]);
    }
    fetchUploads();
  }, []);

  const handleSelectProfilePic = async (src) => {
    setUploadingPic(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile(auth.currentUser, { photoURL: src });
      setShowPicModal(false);
      setSuccess("Profile picture updated!");
    } catch (err) {
      setError("Failed to update profile picture");
    }
    setUploadingPic(false);
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPic(true);
    setError("");
    setSuccess("");
    try {
      // Upload to /uploads and get URL
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        await updateProfile(auth.currentUser, { photoURL: data.url });
        setShowPicModal(false);
        setSuccess("Profile picture updated!");
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError("Failed to upload profile picture");
    }
    setUploadingPic(false);
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-md flex justify-start mb-2">
        <a href="/home" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 bg-blue-50 rounded transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Home
        </a>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 w-full max-w-md">
        <div className="relative group cursor-pointer" onClick={() => setShowPicModal(true)}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-2 border-blue-500 shadow object-cover" />
          ) : (
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" className="w-24 h-24 rounded-full border-2 border-blue-500 bg-gray-100 shadow">
              <circle cx="12" cy="12" r="12" fill="#e0e7ef" />
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#2563eb" />
            </svg>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-semibold">Change</span>
          </div>
        </div>
        {showPicModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowPicModal(false)}
          >
            <div
              style={{
                position: 'relative',
                background: 'white',
                borderRadius: 16,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
                padding: 32,
                minWidth: 320,
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPicModal(false)}
                style={{
                  position: 'fixed',
                  top: 32,
                  right: 32,
                  background: '#222',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  fontSize: 28,
                  cursor: 'pointer',
                  zIndex: 3100,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
                aria-label="Close"
              >
                ×
              </button>
              {/* Only keep the bold, dark title below */}
                <div className="mb-4 text-lg font-semibold text-gray-900">Select or Upload a Profile Picture</div>
              <div className="grid grid-cols-4 gap-4 mb-4 max-h-60 overflow-y-auto">
                {galleryImages.map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt="Gallery option"
                    className="w-20 h-20 object-cover rounded-full border-2 cursor-pointer hover:border-blue-500"
                    style={{ borderColor: user.photoURL === src ? '#2563eb' : '#e5e7eb' }}
                    onClick={() => handleSelectProfilePic(src)}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center gap-2 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleUploadPic}
                      style={{ display: 'none' }}
                      disabled={uploadingPic}
                    />
                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer mb-2"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      disabled={uploadingPic}
                    >
                      Upload Picture
                    </button>
                    {fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0] && (
                      <span className="text-gray-900 font-medium text-sm">
                        {fileInputRef.current.files[0].name}
                      </span>
                    )}
                    {uploadingPic && <div className="text-blue-900 font-semibold">Uploading...</div>}
              </div>
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                {error && <div className="text-red-800 text-sm mt-2 font-semibold">{error}</div>}
            </div>
          </div>
        )}
        <div className="flex flex-col items-center gap-1 mt-4 mb-2">
          <div className="text-xl font-bold text-gray-900">{user.displayName || user.email}</div>
          <div className="text-gray-600">{user.email}</div>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-1">First Name</label>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full text-gray-900"
                style={{ color: '#1a1a1a' }}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full text-gray-900"
                style={{ color: '#1a1a1a' }}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Display Name</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full text-gray-900"
              style={{ color: '#1a1a1a' }}
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Display Name"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 cursor-pointer"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {success && <div className="text-green-600 text-sm">{success}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
}
