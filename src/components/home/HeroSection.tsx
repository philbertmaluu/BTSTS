import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const HeroSection: React.FC = () => {
  const { user } = useAuth();
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    });
  }, [controls]);

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent dark:from-primary-900/20" />

      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.15),transparent_20%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.1),transparent_20%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,165,0,0.1),transparent_20%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(255,165,0,0.05),transparent_20%)]" />
      </div>

      <div className="container mx-auto px-4 z-10 pt-24 pb-16 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 dark:text-white leading-tight mb-6">
              Welcome 
              <span className="text-primary-500"> to the</span>
              <br />
              Basketball Dar es salaam League
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-lg">
             We are the Basketball Association within Dar es salaam Region. We have full authority over the basketball sport in Dar es salaam and we are responsible for all Basketball development activities in Dar es salaaam Region.
              The Basketball Dar es salaam league (BDL) is the biggest basketball league in Tanzania
              </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" rightIcon={<ChevronRight size={18} />}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    
                  </Link>
                  <Link to="/about">
                    
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden md:block relative"
          >
            <div className="relative mx-auto w-full max-w-md aspect-square">
              {/* Basketball court illustration */}
              <svg
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto text-primary-500 dark:text-primary-400"
              >
                <rect x="50" y="50" width="400" height="400" rx="8" stroke="currentColor" strokeWidth="4" />
                <circle cx="250" cy="250" r="80" stroke="currentColor" strokeWidth="4" />
                <path d="M50 250H450" stroke="currentColor" strokeWidth="4" />
                <path d="M250 50V450" stroke="currentColor" strokeWidth="4" />
                <path d="M170 250C170 205.817 205.817 170 250 170" stroke="currentColor" strokeWidth="4" />
                <path d="M330 250C330 294.183 294.183 330 250 330" stroke="currentColor" strokeWidth="4" />
                <circle cx="250" cy="250" r="10" fill="currentColor" />
              </svg>

              {/* Animated basketball */}
              <motion.div
                className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)] w-10 h-10 bg-primary-500 rounded-full"
                animate={{
                  x: [0, 120, 120, 0, 0],
                  y: [0, 0, 120, 120, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave pattern at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16 lg:h-20"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
            className="text-white dark:text-neutral-900 opacity-25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill="currentColor"
            className="text-white dark:text-neutral-900 opacity-10"
          />
        </svg>
      </div>
    </div>
  );
};