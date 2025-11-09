import React, { useState, useEffect } from 'react';
import { fetchImagesFromS3 } from './services/s3Service';
import PhotoCard from './components/PhotoCard';
import CategoryFilter from './components/CategoryFilter';
import Lightbox from './components/Lightbox';
import LoadingSkeleton from './components/LoadingSkeleton';
import SearchBar from './components/SearchBar';
import EmptyState from './components/EmptyState';

function App() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get unique categories
  const categories = ['all', ...new Set(images.map(img => img.category))];

  // Fetch images on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const fetchedImages = await fetchImagesFromS3();
        setImages(fetchedImages);
        setFilteredImages(fetchedImages);
      } catch (err) {
        setError(err.message);
        console.error('Error loading images:', err);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Filter images based on category and search
  useEffect(() => {
    let filtered = images;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(img => img.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(img =>
        img.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  }, [activeCategory, searchTerm, images]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle search
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm('');
    setActiveCategory('all');
  };

  // Handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
  };

  // Navigate between images in lightbox
  const handleNavigate = (direction) => {
    const currentIndex = filteredImages.findIndex(
      img => img.key === selectedImage.key
    );
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex + 1;
    } else {
      newIndex = currentIndex - 1;
    }

    if (newIndex >= 0 && newIndex < filteredImages.length) {
      setSelectedImage(filteredImages[newIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-indigo-600 to-purple-600 text-center
                       mb-2">
            📸 Photo Gallery
          </h1>
          <p className="text-gray-600 text-center">
            Powered by AWS S3 & React
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8
                        shadow-lg animate-fadeIn">
            <div className="flex items-start">
              <svg className="h-6 w-6 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-bold">Error loading images</strong>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Gallery */}
        {!loading && !error && (
          <>
            {/* Search Bar */}
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* Image Count */}
            <div className="text-center mb-8">
              <p className="text-gray-600 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Showing <span className="font-semibold text-indigo-600">{filteredImages.length}</span> {filteredImages.length === 1 ? 'image' : 'images'}
              </p>
            </div>

            {/* Image Grid or Empty State */}
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image, index) => (
                  <PhotoCard
                    key={image.key}
                    image={image}
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState searchTerm={searchTerm} onReset={handleReset} />
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      <Lightbox
        image={selectedImage}
        images={filteredImages}
        onClose={closeLightbox}
        onNavigate={handleNavigate}
      />

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-2">Built with React, Tailwind CSS & AWS S3</p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span>✨ Scroll animations</span>
            <span>•</span>
            <span>🔍 Search & filter</span>
            <span>•</span>
            <span>⌨️ Keyboard shortcuts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;