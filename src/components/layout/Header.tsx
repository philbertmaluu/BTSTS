import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, User, LogOut, Settings } from "lucide-react";
import { Button } from "../ui/Button";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Matches", path: "/matches" },
<<<<<<< HEAD
    { name: "Players", path: "/players" },
    { name: "Teams", path: "/teams" },
    { name: "News", path: "/news" },
=======
    { name: "Teams", path: "/teams" },
    {name: "TeamStandings", path:"/teamstandings"}
>>>>>>> 173d77b0001df2eb41b49b2bab3a04fa8442dc0e
  ];

  // Add protected routes based on user role
  if (user) {
    if (user.role === "admin") {
      navItems.push({ name: "Admin", path: "/admin" });
    }
    if (user.role === "statistician") {
<<<<<<< HEAD
      navItems.push({ name: "Stats", path: "/stats" });
=======
      navItems.push({ name: "Team Standings", path: "/stats" });
>>>>>>> 173d77b0001df2eb41b49b2bab3a04fa8442dc0e
    }
    if (user.role === "coach") {
      navItems.push({ name: "Coach", path: "/coach" });
    }
  }

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${
      isScrolled
        ? "bg-white dark:bg-neutral-900 shadow-md py-2"
        : "bg-transparent py-4"
    }
  `;

  const activeNavClass = "text-primary-500 dark:text-primary-400 font-semibold";
  const inactiveNavClass =
    "text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/icons/icons8-basketball-100.png"
              alt="HoopStats Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-display font-bold text-neutral-900 dark:text-white">
<<<<<<< HEAD
              HoopStats
=======
              BDL
>>>>>>> 173d77b0001df2eb41b49b2bab3a04fa8442dc0e
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  text-sm font-medium transition-colors
                  ${
                    location.pathname === item.path
                      ? activeNavClass
                      : inactiveNavClass
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons/buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* Auth buttons or user menu */}
            {user ? (
              <div className="relative group">
                <motion.button
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-8 w-8 rounded-full object-cover border-2 border-primary-500"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {user.firstName}
                  </span>
                </motion.button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[60px] bg-white dark:bg-neutral-900 z-40 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 60px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      text-lg font-medium p-2 rounded-md transition-colors
                      ${
                        location.pathname === item.path
                          ? `${activeNavClass} bg-neutral-100 dark:bg-neutral-800`
                          : inactiveNavClass
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {!user && (
                <div className="flex flex-col space-y-2 mt-6">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
