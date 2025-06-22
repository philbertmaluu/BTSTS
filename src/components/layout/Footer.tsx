import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Github as GitHub } from 'lucide-react';
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
                HoopStats
              </span>
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              Your comprehensive basketball statistics tracking platform. Follow games, analyze player performance, and stay updated with the latest news.
            </p>
            <div className="flex space-x-4">
<<<<<<< HEAD
              <a href="#" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400" aria-label="Email">
                <Mail size={20} />
              </a>
              <a href="#" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400" aria-label="GitHub">
                <GitHub size={20} />
              </a>
=======
              <a href="https://www.instagram.com/basketballdsm/?hl=en" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400" aria-label="Instagram">
                <Instagram size={20} />
              </a>
>>>>>>> 173d77b0001df2eb41b49b2bab3a04fa8442dc0e
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/matches" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Matches
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/players" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Players
                </Link>
              </li>
              <li>
=======
>>>>>>> 173d77b0001df2eb41b49b2bab3a04fa8442dc0e
                <Link to="/teams" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Teams
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/news" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  News
                </Link>
              </li>
              <li>
                <Link to="/stats" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Statistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Contact Support
=======
                <Link to="/teamstandings" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  TeamStandings
>>>>>>> 173d77b0001df2eb41b49b2bab3a04fa8442dc0e
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  About Us
                </Link>
              </li>
<<<<<<< HEAD
              <li>
                <Link to="/careers" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Terms of Service
                </Link>
              </li>
=======
>>>>>>> 173d77b0001df2eb41b49b2bab3a04fa8442dc0e
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2 md:mb-0">
              © {new Date().getFullYear()} HoopStats. All rights reserved.
            </p>
<<<<<<< HEAD
            <ul className="flex space-x-4 text-sm">
              <li>
                <Link to="/privacy" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
                  Cookies
                </Link>
              </li>
            </ul>
=======
>>>>>>> 173d77b0001df2eb41b49b2bab3a04fa8442dc0e
          </div>
        </div>
      </div>
    </footer>
  );
};