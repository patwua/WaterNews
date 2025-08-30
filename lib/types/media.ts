export type MediaType = 'image' | 'video';

export interface MediaSlice {
  id: string;
  type: MediaType;
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  duration?: number;
  provider?: 'cloudinary' | 'static' | 'other';
  article: {
    id: string;
    slug: string;
    title: string;
  };
}
