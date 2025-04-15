
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Calculator from "@/components/Calculator";
import Steps from "@/components/Steps";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import AppDownload from "@/components/AppDownload";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Calculator />
      <Steps />
      <Testimonials />
      <Contact />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Index;
