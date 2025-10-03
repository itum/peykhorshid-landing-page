import axios from 'axios';

// تعیین URL بر اساس محیط
const getBaseURL = () => {
  // بررسی اینکه آیا در localhost هستیم یا نه
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname === '::1';
  
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // اگر در localhost هستیم، از localhost استفاده کنیم
  if (isLocalhost) {
    return 'http://localhost:3001';
  }
  
  // در غیر این صورت از production استفاده کنیم
  return 'https://ghesti.peykkhorshid.ir';
};

const API_URL = `${getBaseURL()}/api/upload`;

export interface UploadedImage {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimetype: string;
}

export interface ImageInfo {
  filename: string;
  url: string;
  path: string;
  size: number;
  created: string;
}

// آپلود تصویر
export const uploadImage = async (file: File): Promise<UploadedImage> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(`${API_URL}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

// حذف تصویر
export const deleteImage = async (filename: string): Promise<void> => {
  await axios.delete(`${API_URL}/image/${filename}`);
};

// لیست تصاویر
export const listImages = async (): Promise<ImageInfo[]> => {
  const response = await axios.get(`${API_URL}/images`);
  return response.data.data;
};
