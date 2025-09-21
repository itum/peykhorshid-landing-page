import { useEffect, useState } from "react";
import { CSSProperties } from "react";
import { getSection } from '@/lib/services/contentService';

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIphoneXR, setIsIphoneXR] = useState(false);
  const [heroData, setHeroData] = useState<any>(null);

  // بارگذاری داده‌های Hero از CMS
  useEffect(() => {
    (async () => {
      try {
        const section = await getSection('home', 'hero');
        if (section?.data) {
          const data = typeof section.data === 'string' ? JSON.parse(section.data) : section.data;
          setHeroData(data);
        }
      } catch (error) {
        console.error('Error loading hero data:', error);
      }
    })();
  }, []);

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
            src={heroData?.mobile?.url || "/images/hero-mobile.jpg"} 
            alt={heroData?.mobile?.alt || "hero background mobile"} 
            className={`w-full h-full object-cover ${isIphoneXR ? 'scale-[1.02]' : ''}`}
            style={imageStyle}
            loading="lazy"
            width="1080"
            height="1920"
          />
        ) : (
          <img 
            src={heroData?.desktop?.url || "/images/hero-image-bg.jpg"} 
            alt={heroData?.desktop?.alt || "hero background"} 
            className="w-full h-full object-cover" 
            style={imageStyle}
            loading="lazy"
            width="1920"
            height="1080"
          />
        )}
      </div>
    </section>
  );
};

export default Hero;
