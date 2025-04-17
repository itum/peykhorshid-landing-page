import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // تنظیم مقدار اولیه
    handleResize();

    // اضافه کردن ایونت لیسنر
    window.addEventListener('resize', handleResize);

    // پاکسازی
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section 
      id="hero" 
      className="relative overflow-hidden"
      style={{
        minHeight: isMobile ? "calc(100vh - 70px)" : "100vh",
        padding: 0,
        margin: 0,
        backgroundColor: "#e8f0ff",
        border: "none",
        outline: "none",
        boxShadow: "none"
      }}
    >
      {/* تصویر پس‌زمینه */}
      <div 
        className="absolute inset-0 w-full h-full z-0 flex items-center justify-center" 
        style={{ 
          border: "none",
          outline: "none"
        }}
      >
        <img 
          src="/images/hero-image-bg.jpg" 
          alt="hero background" 
          className="w-full h-full object-cover" 
          style={{
            opacity: 1
          }}
        />
      </div>
      
      {/* گرادیان جهت خوانایی بهتر متن‌ها - حذف شده برای نمایش رنگ اصلی تصویر */}
      
      <div 
        className="container mx-auto px-4 md:px-6 relative z-20 h-full flex items-center"
        style={{
          border: "none",
          outline: "none"
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12">
        </div>
      </div>
    </section>
  );
};

export default Hero;
