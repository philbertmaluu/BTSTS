import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  changePercentage?: number;
  index?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  changePercentage,
  index = 0
}) => {
  // Determine if change is positive, negative or neutral
  const isPositive = changePercentage && changePercentage > 0;
  const isNegative = changePercentage && changePercentage < 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardBody>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                {title}
              </p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                {value}
              </p>
              
              {changePercentage !== undefined && (
                <div className="flex items-center mt-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      isPositive
                        ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400'
                        : isNegative
                        ? 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400'
                        : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {isPositive && '+'}{changePercentage}%
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                    from last game
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-500">
              {icon}
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};