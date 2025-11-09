import React from 'react';

function EmptyState({ searchTerm, onReset }) {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <svg
          className="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <h3 className="text-2xl font-semibold text-gray-700 mb-2">
        No images found
      </h3>
      
      {searchTerm ? (
        <>
          <p className="text-gray-500 mb-6">
            No results for "<span className="font-semibold">{searchTerm}</span>"
          </p>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full
                     hover:bg-indigo-700 transition-colors duration-200
                     font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Clear search
          </button>
        </>
      ) : (
        <p className="text-gray-500">
          Try selecting a different category
        </p>
      )}
    </div>
  );
}

export default EmptyState;