import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Calculator from "@/components/Calculator";
import Steps from "@/components/Steps";
// Removed Testimonials import
import Contact from "@/components/Contact";
import AppDownload from "@/components/AppDownload";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SectionNav from "@/components/SectionNav";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Calculator />
      <Steps />
      {/* Removed Testimonials component */}
      <Contact />
      <AppDownload />
      <Footer />
      <SectionNav />
      <ScrollToTop />
    </div>
  );
};

export default Index;
