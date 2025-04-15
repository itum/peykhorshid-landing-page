
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-peyk-blue">پیک خورشید اهواز</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 space-x-reverse">
          <a href="#features" className="text-gray-700 hover:text-peyk-blue transition-colors">امکانات</a>
          <a href="#calculator" className="text-gray-700 hover:text-peyk-blue transition-colors">محاسبه اقساط</a>
          <a href="#steps" className="text-gray-700 hover:text-peyk-blue transition-colors">مراحل دریافت</a>
          <a href="#contact" className="text-gray-700 hover:text-peyk-blue transition-colors">تماس با ما</a>
          <Button className="gradient-blue">ثبت‌نام</Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 left-0 bg-white shadow-md py-4 px-6 z-50">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 hover:text-peyk-blue transition-colors" onClick={toggleMenu}>امکانات</a>
            <a href="#calculator" className="text-gray-700 hover:text-peyk-blue transition-colors" onClick={toggleMenu}>محاسبه اقساط</a>
            <a href="#steps" className="text-gray-700 hover:text-peyk-blue transition-colors" onClick={toggleMenu}>مراحل دریافت</a>
            <a href="#contact" className="text-gray-700 hover:text-peyk-blue transition-colors" onClick={toggleMenu}>تماس با ما</a>
            <Button className="gradient-blue w-full">ثبت‌نام</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
