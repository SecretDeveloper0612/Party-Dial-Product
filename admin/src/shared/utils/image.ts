export const getAppwriteImageUrl = (fileId: string | any) => {
  if (!fileId) return "/gallery/interior.png";
  
  // Handle object structure: { id: "...", category: "..." }
  const id = typeof fileId === 'string' ? fileId : (fileId.id || fileId.$id);
  
  if (!id) return "/gallery/interior.png";
  
  // Use environment variables or hardcoded fallbacks
  // PROXY: Use our own server API to bypass any CORS / Platform / Permissions blocks
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'venues_photos';
  
  // Create a URL pointing to our proxy
  return `${serverUrl}/venues/proxy/image/${bucketId}/${id}`;
};

export interface GalleryPhoto {
    id: string;
    category: string;
}

export const parsePhotos = (photosData: any): GalleryPhoto[] => {
  if (!photosData) return [];
  
  try {
    const parsed = typeof photosData === 'string' ? JSON.parse(photosData) : photosData;
    if (Array.isArray(parsed)) {
      return parsed.map(p => {
         if (typeof p === 'string') return { id: p, category: 'All Photos' };
         return { 
           id: p.id || p.$id || '', 
           category: p.category || 'All Photos' 
         };
      }).filter(p => p.id && p.category !== 'Profile');
    }
  } catch (e) {
    console.error("Error parsing photos:", e);
  }
  
  return [];
};
