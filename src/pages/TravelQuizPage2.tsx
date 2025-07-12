import React from 'react';
import TravelQuiz2 from '../components/TravelQuiz2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TravelQuizPage2: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <TravelQuiz2 />
      </main>
      <Footer />
    </div>
  );
};

export default TravelQuizPage2; 