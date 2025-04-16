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
      <Calculator />
      <Steps />
      {/* Removed Testimonials component */}
      <PopularRoutes />
      <ContactUs />
      <Footer />
      <SectionNav />
      <ScrollToTop />
      <QuizBanner />
    </div>
  );
};

export default Index;
