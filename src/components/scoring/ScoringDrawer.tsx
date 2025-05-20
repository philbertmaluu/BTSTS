import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/Button';

interface ScoringDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    id: string;
    homeTeam: {
      name: string;
      score: number;
      logo: string;
    };
    awayTeam: {
      name: string;
      score: number;
      logo: string;
    };
    status: string;
    startTime: string;
    venue: string;
  };
  onScoreUpdate: (team: 'home' | 'away', points: number) => void;
}

export const ScoringDrawer: React.FC<ScoringDrawerProps> = ({
  isOpen,
  onClose,
  match,
  onScoreUpdate,
}) => {
  const scoreOptions = [1, 2, 3];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-800 shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Match Scoring
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full"
              >
                <X size={20} className="text-neutral-500 dark:text-neutral-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-8">
              {/* Home Team */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {match.homeTeam.name}
                    </h3>
                    <p className="text-3xl font-bold text-primary-500">
                      {match.homeTeam.score}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {scoreOptions.map((points) => (
                    <React.Fragment key={`home-${points}`}>
                      <Button
                        onClick={() => onScoreUpdate('home', points)}
                        leftIcon={<Plus size={16} />}
                        className="flex-1"
                      >
                        +{points}
                      </Button>
                      <Button
                        onClick={() => onScoreUpdate('home', -points)}
                        leftIcon={<Minus size={16} />}
                        variant="outline"
                        className="flex-1"
                      >
                        -{points}
                      </Button>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 my-4" />

              {/* Away Team */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {match.awayTeam.name}
                    </h3>
                    <p className="text-3xl font-bold text-primary-500">
                      {match.awayTeam.score}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {scoreOptions.map((points) => (
                    <React.Fragment key={`away-${points}`}>
                      <Button
                        onClick={() => onScoreUpdate('away', points)}
                        leftIcon={<Plus size={16} />}
                        className="flex-1"
                      >
                        +{points}
                      </Button>
                      <Button
                        onClick={() => onScoreUpdate('away', -points)}
                        leftIcon={<Minus size={16} />}
                        variant="outline"
                        className="flex-1"
                      >
                        -{points}
                      </Button>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Match Info */}
              <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  <span className="font-semibold">Venue:</span> {match.venue}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  <span className="font-semibold">Start Time:</span>{' '}
                  {new Date(match.startTime).toLocaleString()}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  <span className="font-semibold">Status:</span>{' '}
                  {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};