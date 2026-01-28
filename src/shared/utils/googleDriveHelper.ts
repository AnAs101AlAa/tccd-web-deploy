// completley made by AI 

/**
 * Converts a Google Drive sharing URL to a direct image URL
 * @param url - The Google Drive URL or any other URL
 * @returns The direct image URL
 * 
 * Note: Google Drive files must be set to "Anyone with the link can view" 
 * for the images to display properly.
 */
export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return url;

  // Check if it's a Google Drive URL with /file/d/ pattern
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  
  if (driveMatch) {
    const fileId = driveMatch[1];
    // Use the thumbnail API which works better for publicly shared files
    // sz=w1000 provides good quality, you can adjust the size as needed
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  // Check if it's already a direct Google Drive URL
  if (url.includes('drive.google.com/uc') || url.includes('drive.google.com/thumbnail')) {
    return url;
  }

  // Return the original URL if it's not a Google Drive URL
  return url;
};
