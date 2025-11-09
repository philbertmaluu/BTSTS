import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { Basketball } from '../icons/Basketball';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Basketball className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-display font-bold text-neutral-900 dark:text-white">
               BDL
              </span>
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              It's more than just a game
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/basketballdsm/?hl=en" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-1">
            {/* <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Company
            </h3> */}
            <ul className="space-y-2">
              <li>
                {/* <Link to="/about" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  About Us
                </Link> */}
              </li>
            </ul>
          </div>

          {/* Quick links - Explore (moved to rightmost column) */}
          <div className="md:col-span-1 md:col-start-4 flex flex-col items-end">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 text-right">
              Explore
            </h3>
            <ul className="space-y-2 text-right">
              <li>
                <Link to="/matches" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Matches
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/teamstandings" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  TeamStandings
                </Link>
              </li>
              <li>
                <Link to="/match-results" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Match Results
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2 md:mb-0">
              © {new Date().getFullYear()} BDL. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};