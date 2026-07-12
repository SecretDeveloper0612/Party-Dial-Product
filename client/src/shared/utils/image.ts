// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAppwriteImageUrl = (fileId: string | any) => {
  if (!fileId) return "/gallery/interior.png";
  
  // Handle object structure: { id: "...", category: "..." }
  const id = typeof fileId === 'string' ? fileId : (fileId.id || fileId.$id);
  
  if (!id) return "/gallery/interior.png";

  // If it's already a full URL or a local path, return it directly
  if (id.startsWith('http') || id.startsWith('/') || id.startsWith('file:')) {
    return id;
  }
  
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2';
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'venues_photos';
  
  // Use direct Appwrite view URL because images now have public read permissions
  return `${endpoint}/storage/buckets/${bucketId}/files/${id}/view?project=${projectId}`;
};

export interface GalleryPhoto {
    id: string;
    category: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
