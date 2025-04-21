import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { CSSProperties } from "react";
import { useMediaQuery } from '@/hooks/useMediaQuery';

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIphoneXR, setIsIphoneXR] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      
      // تشخیص دقیق‌تر iPhone XR (414x896)
      const isXRDimensions = (width === 414 && height === 896) || 
                            // برای حالت افقی
                            (width === 896 && height === 414) ||
                            // برای حالات نزدیک به iPhone XR
                            ((width >= 410 && width <= 420) && 
                            (height >= 890 && height <= 900));
      
      // تشخیص اضافی با user-agent برای مرورگرهایی که این اطلاعات را فراهم می‌کنند
      const userAgent = navigator.userAgent;
      const isAppleDevice = /iPhone/.test(userAgent);
      
      setIsIphoneXR(isXRDimensions && isAppleDevice);
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

  // استایل‌های خاص برای iPhone XR
  const heroStyle: CSSProperties = {
    minHeight: isIphoneXR 
      ? "calc(100vh - 70px)" 
      : isMobile 
        ? "calc(100vh - 70px)" 
        : "100vh",
    padding: 0,
    margin: 0,
    backgroundColor: "#e8f0ff",
    border: "none",
    outline: "none",
    boxShadow: "none"
  };

  // استایل‌های تصویر برای iPhone XR
  const imageStyle: CSSProperties = {
    opacity: 1,
    objectFit: "cover" as "cover",
    objectPosition: isIphoneXR ? "center 20%" : "center center",
  };

  return (
    <section 
      id="hero" 
      className="relative overflow-hidden"
      style={heroStyle}
    >
      {/* تصویر پس‌زمینه */}
      <div 
        className="absolute inset-0 w-full h-full z-0 flex items-center justify-center" 
        style={{ 
          border: "none",
          outline: "none"
        }}
      >
        {isMobile || isIphoneXR ? (
          <img 
            src="/images/hero-mobile.jpg" 
            alt="hero background mobile" 
            className={`w-full h-full object-cover ${isIphoneXR ? 'scale-[1.02]' : ''}`}
            style={imageStyle}
            loading="lazy"
            width="1080"
            height="1920"
          />
        ) : (
          <img 
            src="/images/hero-image-bg.jpg" 
            alt="hero background" 
            className="w-full h-full object-cover" 
            style={imageStyle}
            loading="lazy"
            width="1920"
            height="1080"
          />
        )}
      </div>
      
      {/* گرادیان جهت خوانایی بهتر متن‌ها - حذف شده برای نمایش رنگ اصلی تصویر */}
      
      <div 
        className={`container mx-auto px-4 md:px-6 relative z-20 h-full flex items-center ${isIphoneXR ? 'pt-12 px-5' : ''}`}
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
