import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Clock, Users, Trophy, Zap, Search, BarChart3, ShieldCheck } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        motionProps={{
          whileHover: { y: -5 },
          transition: { type: 'spring', stiffness: 300 }
        }}
        className="h-full"
      >
        <CardBody>
          <div className="mb-4 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-500">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
          <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Real-time Statistics',
      description: 'Track game stats as they happen with our live updating system.',
      icon: <Zap size={24} />
    },
    {
      title: 'Performance Analytics',
      description: 'Dive deep into player performance with advanced analytics.',
      icon: <LineChart size={24} />
    },
    {
      title: 'Live Match Tracking',
      description: 'Follow games in real-time with play-by-play updates.',
      icon: <Clock size={24} />
    },
    {
      title: 'Team Management',
      description: 'Manage team rosters, schedules, and performance metrics.',
      icon: <Users size={24} />
    },
    {
      title: 'Tournament Brackets',
      description: 'Create and manage tournament brackets with automatic updates.',
      icon: <Trophy size={24} />
    },
    {
      title: 'Player Search',
      description: 'Find detailed statistics for any player in the database.',
      icon: <Search size={24} />
    },
    {
      title: 'Visual Reports',
      description: 'Generate visual reports to easily understand team trends.',
      icon: <BarChart3 size={24} />
    },
    {
      title: 'Secure Data',
      description: 'All your team and player data is securely stored and backed up.',
      icon: <ShieldCheck size={24} />
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features for Basketball Enthusiasts
          </motion.h2>
          <motion.p
            className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to track, analyze, and improve basketball performance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};