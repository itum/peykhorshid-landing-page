import axios from 'axios';

// تعیین URL بر اساس محیط
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.PROD) {
    return 'https://ghesti.peykkhorshid.ir';
  }
  return 'http://localhost:3001';
};

const API_URL = `${getBaseURL()}/api/content`;

export type ContentItem = {
  id?: number;
  page: string; // مثل: 'home', 'quiz', 'quiz2'
  section_key: string; // مثل: 'hero', 'features', 'popular_routes'
  title?: string | null;
  data?: any; // شیء ساختاری شامل متن‌ها، تصاویر، لیست‌ها
  sort_order?: number;
  is_active?: number | boolean;
  created_at?: string;
  updated_at?: string;
};

export const listContent = async (page?: string): Promise<ContentItem[]> => {
  const url = page ? `${API_URL}?page=${encodeURIComponent(page)}` : API_URL;
  const res = await axios.get(url);
  return res.data.data;
};

export const getSection = async (page: string, sectionKey: string): Promise<ContentItem | null> => {
  try {
    const res = await axios.get(`${API_URL}/${encodeURIComponent(page)}/${encodeURIComponent(sectionKey)}`);
    return res.data.data;
  } catch (e) {
    return null;
  }
};

export const createSection = async (item: ContentItem): Promise<{ id: number }> => {
  const res = await axios.post(API_URL, item);
  return res.data.data;
};

export const updateSection = async (id: number, item: Partial<ContentItem>): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, item);
};

export const deleteSection = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// بکاپ کامل محتوا
export const backupContent = async (): Promise<Blob> => {
  const response = await axios.get(`${API_URL}/backup`, {
    responseType: 'blob'
  });
  return response.data;
};

// ریستور محتوا
export const restoreContent = async (backupData: any): Promise<{ message: string; restoredCount: number }> => {
  const response = await axios.post(`${API_URL}/restore`, { backupData });
  return response.data;
};


