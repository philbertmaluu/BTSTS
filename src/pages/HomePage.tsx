import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { UpcomingMatchesSection } from '../components/home/UpcomingMatchesSection';

export const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <UpcomingMatchesSection />
      </main>
      <Footer />
    </motion.div>
  );
};