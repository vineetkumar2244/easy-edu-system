
/**
 * File Storage Utility
 * 
 * This module provides functions to save and retrieve files from local storage.
 * Files are stored in the 'public/uploads' directory, organized by content type.
 */

// Define the directory structure for storing files
const STORAGE_BASE_DIR = 'uploads';
const STORAGE_PATHS = {
  video: `${STORAGE_BASE_DIR}/videos`,
  pdf: `${STORAGE_BASE_DIR}/documents`,
};

/**
 * Saves a file to local storage and returns the file path
 */
export const saveFile = async (file: File, contentType: 'video' | 'pdf', fileName: string): Promise<string> => {
  try {
    // Create a unique file name to prevent overwrites
    const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Determine the storage directory based on content type
    const storagePath = STORAGE_PATHS[contentType];
    
    // In a real implementation, we would use a server-side API to save the file
    // For this demo, we'll simulate storing by creating a URL with metadata
    
    // Read the file as an array buffer
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    
    // Create a URL for the blob (this is temporary and will not persist)
    const url = URL.createObjectURL(blob);
    
    // In a real implementation, we would save the file to disk
    // Store file metadata in localStorage to simulate persistence
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles') || '{}');
    const filePath = `${storagePath}/${uniqueFileName}`;
    
    storedFiles[filePath] = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      url // Store the temporary URL
    };
    
    localStorage.setItem('storedFiles', JSON.stringify(storedFiles));
    
    console.log(`File stored at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
};

/**
 * Retrieves a file from local storage by path
 */
export const getFile = (filePath: string): { url: string; name: string; type: string } | null => {
  try {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles') || '{}');
    const fileData = storedFiles[filePath];
    
    if (!fileData) {
      console.error(`File not found: ${filePath}`);
      return null;
    }
    
    return {
      url: fileData.url,
      name: fileData.name,
      type: fileData.type
    };
  } catch (error) {
    console.error('Error retrieving file:', error);
    return null;
  }
};

/**
 * Deletes a file from local storage by path
 */
export const deleteFile = (filePath: string): boolean => {
  try {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles') || '{}');
    
    if (!storedFiles[filePath]) {
      return false;
    }
    
    // Release the object URL to free memory
    URL.revokeObjectURL(storedFiles[filePath].url);
    
    // Remove file from storage
    delete storedFiles[filePath];
    localStorage.setItem('storedFiles', JSON.stringify(storedFiles));
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
