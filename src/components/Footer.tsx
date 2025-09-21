import { Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, Youtube } from 'lucide-react';
import ClickTracker from "./ClickTracker";
import { useEffect, useState } from 'react';
import { getSection } from '@/lib/services/contentService';

const Footer = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const section = await getSection('home', 'footer');
      if (section?.data) {
        try {
          setData(typeof section.data === 'string' ? JSON.parse(section.data) : section.data);
        } catch {
          setData(section.data);
        }
      }
    })();
  }, []);

  const bgStyle = () => {
    const type = data?.background?.type || 'gradient';
    if (type === 'solid') {
      return { background: data?.background?.from || '#f3f4f6' } as React.CSSProperties;
    }
    if (type === 'image') {
      return { 
        backgroundImage: `url(${data?.background?.image})`,
        backgroundSize: data?.background?.size || 'cover',
        backgroundPosition: data?.background?.position || 'center',
        backgroundRepeat: 'no-repeat'
      } as React.CSSProperties;
    }
    const from = data?.background?.from || '#f3f4f6';
    const to = data?.background?.to || '#e5e7eb';
    return { backgroundImage: `linear-gradient(to right, ${from}, ${to})` } as React.CSSProperties;
  };

  return (
    <footer className="text-gray-700" style={bgStyle()}>
      <div className="container mx-auto py-12 px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">پیک خورشید اهواز</h3>
            <p className="leading-relaxed">{data?.company_description || 'سامانه خرید اقساطی آنلاین و چک صیادی، با سفته الکترونیکی. همراه شما در مسیر خرید آسان و مطمئن.'}</p>
            <div className="flex space-x-3 space-x-reverse">
              {(data?.social_links || []).map((s: any, idx: number) => {
                const icon = s.type === 'instagram' ? <Instagram className="h-5 w-5" />
                  : s.type === 'twitter' ? <Twitter className="h-5 w-5" />
                  : s.type === 'linkedin' ? <Linkedin className="h-5 w-5" />
                  : s.type === 'facebook' ? <Facebook className="h-5 w-5" />
                  : <Youtube className="h-5 w-5" />;
                return (
                  <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md hover:bg-peyk-blue hover:text-white transition-all duration-300" aria-label={s.type}>
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">خدمات ما</h3>
            <ul className="space-y-3">
              {(data?.services || []).map((svc: any, idx: number) => (
                <li key={idx}>
                  <a href={svc.url} className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                    <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                    {svc.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">لینک‌های مفید</h3>
            <ul className="space-y-3">
              {(data?.useful_links || []).map((lnk: any, idx: number) => (
                <li key={idx}>
                  <a href={lnk.url} className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                    <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                    {lnk.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">تماس با ما</h3>
            <ul className="space-y-3">
              {(data?.addresses || []).map((addr: any, idx: number) => (
                <li key={idx} className="flex items-start group">
                  <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-peyk-blue group-hover:text-white transition-all duration-300 ml-3 mt-1">
                    <MapPin className="h-5 w-5 text-peyk-blue group-hover:text-white" />
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-gray-800">{addr.title}</span>
                    <a href={addr.mapUrl || '#'} target="_blank" rel="noopener noreferrer" className="group-hover:text-peyk-blue transition-colors duration-300 text-sm hover:underline">{addr.address}</a>
                  </div>
                </li>
              ))}
              <li className="mt-4">
                <span className="block font-bold text-sm text-gray-800 mb-2 border-r-2 border-peyk-blue pr-2">پشتیبانی تور:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(data?.support_phones || []).map((ph: string, idx: number) => (
                    <ClickTracker key={idx} itemType="support" itemId={ph} itemName={`پشتیبانی تور ${idx+1}`}>
                      <a href={`tel:${ph}`} className="bg-gradient-to-r from-peyk-blue to-blue-500 text-white text-xs px-3 py-1.5 rounded-full hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center">
                        <Phone className="h-3 w-3 ml-1 animate-pulse" />
                        {ph}
                      </a>
                    </ClickTracker>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="mb-2 md:mb-0">
                {data?.copyright_text || 'تمامی حقوق محفوظ است © ۱۴۰۴'} 
                <a 
                  href={data?.company_url || "https://peykkhorshid.ir/"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-peyk-blue hover:text-peyk-blue-dark transition-colors"
                >
                  {data?.company_name || 'پیک خورشید اهواز'}
                </a>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {(data?.badges || []).map((b: any, idx: number) => (
                <div key={idx} className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <a href={b.url || '#'} target="_blank" rel="noopener noreferrer">
                    <img src={b.image} alt={b.alt || "badge"} className="h-14 w-auto" loading="lazy" width="56" height="56" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {data?.developer_credit !== false && (
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center items-center">
              <a 
                href={data?.developer_url || "https://farazec.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative py-3 px-6 bg-gradient-to-r from-white via-blue-50 to-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-2 justify-center">
                  <span className="inline-block w-3 h-3 bg-peyk-blue rounded-full group-hover:animate-ping"></span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-peyk-blue via-blue-500 to-peyk-blue text-sm font-semibold group-hover:scale-105 transition-all duration-300">
                    {data?.developer_text || 'طراحی و پیاده‌سازی شده توسط تجارت الکترونیک فراز'}
                  </span>
                  <span className="inline-block w-3 h-3 bg-peyk-blue rounded-full group-hover:animate-ping"></span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-all duration-700"></div>
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
