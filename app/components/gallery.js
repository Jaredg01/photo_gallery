import React, { useState } from 'react';

export default function Gallery({ uploadedImages = [], refreshUploads, defaultImages: propDefaultImages = [] }) {
	const [selected, setSelected] = useState(null);
	const [showStock, setShowStock] = useState(false);
	const allImages = showStock ? propDefaultImages : uploadedImages;

	// Helper to get filename from /uploads/filename.ext
	function getFilename(url) {
		// Decode URI component to get the real filename
		return decodeURIComponent(url.split('/').pop());
	}

	async function handleDelete() {
		if (!selected) return;
		const filename = getFilename(selected);
		try {
			await fetch('/api/uploads/delete/', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ filename }),
			});
			if (refreshUploads) await refreshUploads();
			setSelected(null);
		} catch (e) {
			alert('Failed to delete image.');
		}
	}

	return (
		<>
			{/* Navigation Bar */}
			<nav className="w-full mb-8">
	<div className="w-full max-w-5xl mx-auto flex gap-8 py-4 px-8 rounded-3xl shadow-lg border-b-4 border-blue-500 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 items-center justify-center">
					<button
						className={`px-7 py-2 rounded-full font-bold text-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-blue-400
							${!showStock
								? 'bg-white text-blue-700 shadow-lg border-2 border-white scale-105'
								: 'bg-blue-400/20 text-white hover:bg-white/20 border-2 border-transparent'}`}
						onClick={() => setShowStock(false)}
						style={{ boxShadow: !showStock ? '0 4px 16px 0 rgba(60,64,67,0.10)' : undefined }}
					>
						Your Gallery
					</button>
					<button
						className={`px-7 py-2 rounded-full font-bold text-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-blue-400
							${showStock
								? 'bg-white text-blue-700 shadow-lg border-2 border-white scale-105'
								: 'bg-blue-400/20 text-white hover:bg-white/20 border-2 border-transparent'}`}
						onClick={() => setShowStock(true)}
						style={{ boxShadow: showStock ? '0 4px 16px 0 rgba(60,64,67,0.10)' : undefined }}
					>
						Stock Gallery
					</button>
				</div>
			</nav>
			<div
				className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
			>
				{allImages.map((src, idx) => (
					<div
						key={idx}
						className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border border-gray-200 transition-transform hover:scale-105 hover:shadow-xl group"
						style={{ aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
						onClick={() => setSelected(src)}
					>
						<img
							src={src}
							alt={`Gallery image ${idx + 1}`}
							className="object-cover w-full h-full transition-opacity duration-200 group-hover:opacity-90"
							style={{ maxHeight: '100%', maxWidth: '100%' }}
						/>
					</div>
				))}
			</div>
			{selected && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						background: 'rgba(0,0,0,0.8)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 1000,
					}}
					onClick={() => setSelected(null)}
				>
					<button
						onClick={() => setSelected(null)}
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
							zIndex: 2001,
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
							borderRadius: 12,
							boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
							padding: 24,
							maxWidth: '90vw',
							maxHeight: '90vh',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
						onClick={e => e.stopPropagation()}
					>
						<img
							src={selected}
							alt="Selected"
							style={{
								maxWidth: '80vw',
								maxHeight: '70vh',
								borderRadius: 8,
								boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
							}}
						/>
						<button
							onClick={handleDelete}
							style={{
								marginTop: 24,
								padding: '10px 32px',
								background: '#e11d48',
								color: 'white',
								border: 'none',
								borderRadius: 8,
								fontWeight: 'bold',
								fontSize: 16,
								cursor: 'pointer',
								boxShadow: '0 2px 8px rgba(60,64,67,.10)',
								transition: 'background 0.2s',
							}}
						>
							Delete Image
						</button>
					</div>
				</div>
			)}
		</>
	);
}
