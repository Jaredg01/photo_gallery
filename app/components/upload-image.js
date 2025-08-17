"use client"

import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';



export default function UploadImage({ refreshUploads }) {
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [uploadedUrl, setUploadedUrl] = useState('');
	const [error, setError] = useState('');
	const [user, setUser] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setAuthLoading(false);
		});
		return () => unsubscribe();
	}, []);

	const handleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
		} catch (err) {
			setError('Login failed');
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
		} catch (err) {
			setError('Logout failed');
		}
	};

	const handleChange = (e) => {
		setFile(e.target.files[0]);
		setUploadedUrl('');
		setError('');
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) return;
		setUploading(true);
		setError('');
		const formData = new FormData();
		formData.append('file', file);
		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});
			const data = await res.json();
			if (res.ok) {
				setUploadedUrl(data.url);
				if (refreshUploads) await refreshUploads();
				setOpen(false); // Close overlay after successful upload
				setFile(null);
			} else {
				setError(data.error || 'Upload failed');
			}
		} catch (err) {
			setError('Upload failed');
		}
		setUploading(false);
	};


		if (authLoading) return <div>Loading...</div>;

		return (
			<div style={{ margin: '2rem 0' }}>
				{!user ? (
					<button onClick={handleLogin} style={{ marginBottom: 16, padding: '8px 16px', fontWeight: 'bold' }}>
						Log in with Google
					</button>
			) : null}
				   {user && (
					   <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
						   <button
							   onClick={() => setOpen(true)}
							   style={{
								   padding: '10px 24px',
								   background: '#2563eb',
								   color: 'white',
								   border: 'none',
								   borderRadius: 8,
								   fontWeight: 'bold',
								   fontSize: 16,
								   cursor: 'pointer',
								   boxShadow: '0 2px 8px rgba(60,64,67,.08)',
							   }}
						   >
							   Upload Image
						   </button>
					   </div>
				   )}
						{open && (
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
									zIndex: 2000,
								}}
								onClick={() => setOpen(false)}
							>
								<button
									onClick={() => setOpen(false)}
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
										zIndex: 2100,
										boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
									}}
									aria-label="Close"
								>
									×
								</button>
									<div
										style={{
											position: 'relative',
											background: 'white',
											borderRadius: 24,
											boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
											padding: '2.5rem 2.5rem 2rem 2.5rem',
											width: '400px',
											minHeight: '340px',
											maxWidth: '95vw',
											maxHeight: '95vh',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '1.2rem',
											transition: 'width 0.2s, height 0.2s',
										}}
										onClick={e => e.stopPropagation()}
									>
									<form onSubmit={handleUpload} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
										<label htmlFor="file-upload" style={{
											display: 'inline-block',
											padding: '12px 28px',
											background: '#2563eb',
											color: 'white',
											borderRadius: 8,
											fontWeight: 'bold',
											fontSize: 16,
											cursor: !user ? 'not-allowed' : 'pointer',
											marginBottom: 18,
											boxShadow: '0 2px 8px rgba(60,64,67,.10)',
											border: 'none',
											transition: 'background 0.2s',
										}}>
											Choose File
											<input id="file-upload" type="file" accept="image/*" onChange={handleChange} disabled={!user} style={{ display: 'none' }} />
										</label>
										{file && (
											<div style={{ marginBottom: 12, textAlign: 'center', color: '#222', fontSize: 15 }}>
												Selected: <b>{file.name}</b>
											</div>
										)}
										<button
											type="submit"
											disabled={!file || uploading || !user}
											style={{
												marginLeft: 0,
												padding: '10px 24px',
												background: '#2563eb',
												color: 'white',
												border: 'none',
												borderRadius: 8,
												fontWeight: 'bold',
												fontSize: 16,
												cursor: !file || uploading || !user ? 'not-allowed' : 'pointer',
												boxShadow: '0 2px 8px rgba(60,64,67,.08)',
											}}
										>
											{uploading ? 'Uploading...' : 'Upload'}
										</button>
									</form>
									{uploadedUrl && (
										<div style={{ marginTop: '1rem' }}>
											<span>Uploaded: </span>
											<a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
											<br />
											<img src={uploadedUrl} alt="Uploaded" style={{ maxWidth: 200, marginTop: 8 }} />
										</div>
									)}
									{error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
								</div>
							</div>
						)}
			</div>
		);
	}



