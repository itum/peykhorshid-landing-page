import axios from 'axios';
import { getApiUrl } from '@/lib/config/environment';

// آدرس API سرور
const API_URL = getApiUrl('api/contacts');

// تعریف تایپ پیام تماس با ما
export type ContactMessage = {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  message: string;
  destination: string;
  is_read?: boolean;
  created_at?: string;
};

// ثبت پیام جدید
export const sendContactMessage = async (contactData: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<ContactMessage> => {
  try {
    const response = await axios.post(API_URL, contactData);
    return response.data.data;
  } catch (error) {
    console.error('خطا در ارسال پیام تماس با ما:', error);
    throw error;
  }
};

// دریافت تمام پیام‌ها
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('خطا در دریافت پیام‌های تماس با ما:', error);
    throw error;
  }
};

// علامت‌گذاری پیام به عنوان خوانده شده
export const markMessageAsRead = async (id: number | string): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${id}/read`);
  } catch (error) {
    console.error('خطا در به‌روزرسانی وضعیت پیام:', error);
    throw error;
  }
}; 