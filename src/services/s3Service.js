import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Initialize S3 Client with your credentials
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Fetch all images from S3 bucket
 * @returns {Promise<Array>} Array of image objects with metadata
 */
export const fetchImagesFromS3 = async () => {
  try {
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    
    // Create command to list all objects in bucket
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
    });

    // Execute the command
    const response = await s3Client.send(command);

    // Check if we got any objects back
    if (!response.Contents) {
      console.log("No images found in bucket");
      return [];
    }

    // Transform S3 objects into our app's format
    const images = response.Contents
      // Filter out folder markers (they end with /)
      .filter(item => !item.Key.endsWith('/'))
      // Map to our custom format
      .map(item => {
        // Extract category from path (e.g., "nature/sunset.jpg" → "nature")
        const pathParts = item.Key.split('/');
        const category = pathParts.length > 1 ? pathParts[0] : 'uncategorized';
        const fileName = pathParts[pathParts.length - 1];

        return {
          key: item.Key,                    // Full S3 key (path)
          url: `https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${item.Key}`,
          category: category,                // Extracted category
          name: fileName,                    // Just the filename
          size: item.Size,                   // File size in bytes
          lastModified: item.LastModified,   // When uploaded
        };
      });

    console.log(`✅ Fetched ${images.length} images from S3`);
    return images;

  } catch (error) {
    console.error("❌ Error fetching images from S3:", error);
    throw error;
  }
};

/**
 * Fetch images filtered by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} Filtered array of images
 */
export const fetchImagesByCategory = async (category) => {
  const allImages = await fetchImagesFromS3();
  
  if (category === 'all') {
    return allImages;
  }
  
  return allImages.filter(img => img.category === category);
};