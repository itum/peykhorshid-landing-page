import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Guarantees from '@/components/Guarantees';
import Calculator from '@/components/Calculator';
import Steps from '@/components/Steps';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SectionNav from '@/components/SectionNav';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <Guarantees />
      <Calculator />
      <Steps />
      <Contact />
      <Footer />
      <SectionNav />
      <ScrollToTop />
    </main>
  );
} 