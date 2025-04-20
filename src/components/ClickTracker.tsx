import { ReactNode } from 'react';
import { registerClick } from '@/lib/services/statsService';

interface ClickTrackerProps {
  itemType: string;  // نوع آیتم (مثلاً 'support', 'tour', 'domestic', 'special')
  itemId: string;    // شناسه آیتم
  itemName?: string; // نام آیتم (اختیاری)
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  stopPropagation?: boolean; // جلوگیری از انتشار رویداد کلیک
}

/**
 * کامپوننت ردیابی کلیک که برای ثبت کلیک‌ها استفاده می‌شود
 * این کامپوننت را می‌توان دور هر المنت قابل کلیک پیچید
 */
const ClickTracker = ({
  itemType,
  itemId,
  itemName = '',
  children,
  className = '',
  onClick,
  stopPropagation = false
}: ClickTrackerProps) => {
  // ثبت کلیک در دیتابیس
  const handleClick = (e: React.MouseEvent) => {
    // توقف انتشار رویداد در صورت نیاز
    if (stopPropagation) {
      e.stopPropagation();
    }
    
    // ثبت کلیک در API به صورت non-blocking
    try {
      console.log(`ثبت کلیک: ${itemType} - ${itemId} - ${itemName}`);
      registerClick(itemType, itemId, itemName)
        .then(() => console.log(`کلیک با موفقیت ثبت شد: ${itemType} - ${itemId}`))
        .catch(error => console.error('خطا در ثبت کلیک:', error));
    } catch (error) {
      console.error('خطا در ثبت کلیک:', error);
    }

    // اجرای تابع onClick اصلی اگر وجود داشته باشد
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

export default ClickTracker;
