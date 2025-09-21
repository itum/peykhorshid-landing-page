import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PopularRoutes from '../components/PopularRoutes';
import Guarantees from '../components/Guarantees';
import Steps from '../components/Steps';
import TravelQuiz from '../components/TravelQuiz';
import ContactUs from '../components/ContactUs';
import QuizBanner from '../components/QuizBanner';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <PopularRoutes />
        <Guarantees />
        <Steps />
        <QuizBanner />
        <TravelQuiz />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
