import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Calculator from "@/components/Calculator";
import Steps from "@/components/Steps";
// Removed Testimonials import
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SectionNav from "@/components/SectionNav";
import ContactUs from "@/components/ContactUs";
import PopularRoutes from "@/components/PopularRoutes";
import QuizBanner from "@/components/QuizBanner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <PopularRoutes />
      <Calculator />
      <Steps />
      {/* Removed Testimonials component */}
      
      <ContactUs />
      <Footer />
      <SectionNav />
      <ScrollToTop />
      {/* کوییز بنر به صورت خودکار با اسکرول نمایش داده می‌شود */}
      <QuizBanner />
    </div>
  );
};

export default Index;
