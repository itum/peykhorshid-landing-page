import React from 'react';
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
    <div>
      <Hero />
      <Features />
      <PopularRoutes />
      <Guarantees />
      <Steps />
      <QuizBanner />
      <TravelQuiz />
      <ContactUs />
    </div>
  );
};

export default Index;
