import React, { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function PhotoCard({ image, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-xl shadow-lg cursor-pointer 
        transform transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        hover:scale-105 hover:shadow-2xl
        bg-gray-200
      `}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image.url}
          alt={image.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`
            w-full h-full object-cover
            transition-all duration-500
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            group-hover:scale-110
          `}
        />
        
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-semibold text-lg truncate">
              {image.name}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Click to view full size
            </p>
          </div>
        </div>
      </div>

      {/* Category badge */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full 
                       text-xs font-semibold text-gray-800 shadow-md
                       transform group-hover:scale-110 transition-transform duration-200">
          {image.category}
        </span>
      </div>
    </div>
  );
}

export default PhotoCard;