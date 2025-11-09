import React, { useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  //   X,
  Home,
  LogOut,
  TrendingUp,
  Sun,
  Moon,
  Users,
  Group,
  Calendar,
  CheckCircle,
  User,
  MapPin,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/Button";
import { AccountInactive } from "../../pages/AccountInactive";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const DashboardLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    //statician menu
    {
      name: "Scoring",
      path: "/dashboard",
      icon: <Home size={20} />,
      roles: ["Statistician"],
    },

    //admin menu
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home size={20} />,
      roles: ["admin"],
    },
    {
      name: "Manage Teams",
      path: "/admin/teams",
      icon: <Group size={20} />,
      roles: ["admin"],
    },
    {
      name: "Manage Venues",
      path: "/admin/venues",
      icon: <MapPin size={20} />,
      roles: ["admin"],
    },
    {
      name: "Manage Seasons",
      path: "/admin/seasons",
      icon: <Clock size={20} />,
      roles: ["admin"],
    },
    {
      name: "Manage Fixtures",
      path: "/admin/fixtures",
      icon: <Calendar size={20} />,
      roles: ["admin"],
    },
    {
      name: "Manage Results",
      path: "/admin/match-results",
      icon: <CheckCircle size={20} />,
      roles: ["admin"],
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: <Users size={20} />,
      roles: ["admin"],
    },

    //Profile menu for all
    {
      name: "Profile",
      path: "/profile",
      icon: <User size={20} />,
      roles: ["admin", "Statistician"],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => hasRole(role));
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const Sidebar = () => (
    <div className="bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-3">
          <img
            src="/icons/icons8-basketball-100.png"
            alt="BDL Logo"
            className="h-8 w-8"
          />
          {/* <div> */}
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            BDL
          </h1>

          {/* </div> */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* User Profile & Actions */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-3 mb-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.[0] || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {user?.roles?.[0]?.name || "User"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  const MobileSidebar = () => (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full z-50 lg:hidden"
          >
            <Sidebar />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Check if user is active - if not, show AccountInactive page
  if (!user) return null;

  // Check if user is not active (status is not "approved")
  const isUserActive = user.status === "approved";

  if (!isUserActive) {
    return <AccountInactive />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu size={20} />
                </Button>
                <div>
                  {/* <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {filteredNavItems.find(
                      (item) => item.path === location.pathname
                    )?.name || "Dashboard"}
                  </h1> */}
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Welcome back, {user?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </Button>

                {/* Quick Stats */}
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-neutral-600 dark:text-neutral-400">
                    <TrendingUp size={16} />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
