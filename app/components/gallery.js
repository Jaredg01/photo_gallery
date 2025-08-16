import React from 'react';
import Gallery from '../../components/Gallery';

export default function GalleryPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="py-10 px-8 text-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 shadow-lg rounded-full border-b-4 border-blue-500">
				<h1 style={{
					fontFamily: "'Pacifico', cursive, 'Comic Sans MS', 'Brush Script MT', sans-serif",
					fontSize: '2.8rem',
					fontWeight: 900,
					color: '#fff',
					textShadow: '0 4px 24px rgba(60,64,67,0.18)',
					letterSpacing: '0.04em',
					marginBottom: '0.5rem',
					lineHeight: 1.1,
				}}>Your Gallery</h1>
			</header>
			<main style={{ padding: '2rem', flex: 1 }}>
				<Gallery />
			</main>
		</div>
	);
}
