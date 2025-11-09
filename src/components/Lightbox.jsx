import React, { useEffect } from 'react';

function Lightbox({ image, images, onClose, onNavigate }) {
  const currentIndex = images.findIndex(img => img.key === image?.key);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!image) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (canGoPrevious) onNavigate('previous');
          break;
        case 'ArrowRight':
          if (canGoNext) onNavigate('next');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [image, canGoPrevious, canGoNext, onClose, onNavigate]);

  // Download image
  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center
                 animate-fadeIn"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300
                   transition-colors duration-200 z-10 p-2 hover:bg-white/10 rounded-full"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-20 text-white hover:text-gray-300
                   transition-colors duration-200 z-10 p-2 hover:bg-white/10 rounded-full"
        aria-label="Download"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>

      {/* Previous button */}
      {canGoPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('previous');
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white 
                     hover:text-gray-300 transition-colors z-10 p-3 
                     hover:bg-white/10 rounded-full"
          aria-label="Previous image"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {canGoNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('next');
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white 
                     hover:text-gray-300 transition-colors z-10 p-3 
                     hover:bg-white/10 rounded-full"
          aria-label="Next image"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-7xl max-h-full px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.name}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
        
        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent
                       p-6 rounded-b-lg">
          <h3 className="text-white text-xl font-bold mb-2">{image.name}</h3>
          <div className="flex items-center gap-4 text-gray-300 text-sm">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
              {image.category}
            </span>
            <span>{(image.size / 1024).toFixed(0)} KB</span>
            <span>{currentIndex + 1} / {images.length}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 text-gray-400 text-sm text-center">
        <p>Use arrow keys to navigate • ESC to close • Click download icon to save</p>
      </div>
    </div>
  );
}

export default Lightbox;