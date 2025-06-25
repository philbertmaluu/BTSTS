import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardBody } from "../components/ui/Card";
import toast, { Toaster } from "react-hot-toast";

export const LockScreen: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, logout } = useAuth();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      // Assuming the user's email is stored in the auth context
      if (user?.email) {
        await login(user.email, password);
        toast.success("Welcome back!");
        // The login function should handle navigation
      } else {
        toast.error("User information not found");
      }
    } catch (error) {
      console.error("Unlock failed:", error);
      toast.error("Incorrect password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Time and Date */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="text-6xl font-light text-white mb-2 font-mono">
              {formatTime()}
            </div>
            <div className="text-lg text-neutral-300">{formatDate()}</div>
          </motion.div>

          {/* Lock Screen Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardBody className="p-8">
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-white/20">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-white" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-neutral-300 text-sm">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                {/* Lock Icon */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                    <Lock size={24} className="text-white" />
                  </div>
                  <p className="text-neutral-300 text-sm mt-2">
                    Enter your password to unlock
                  </p>
                </div>

                {/* Password Form */}
                <form onSubmit={handleUnlock} className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-neutral-400 focus:border-primary-400 focus:ring-primary-400"
                      leftIcon={<Lock size={18} className="text-neutral-400" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? "Unlocking..." : "Unlock"}
                  </Button>
                </form>

                {/* Logout Option */}
                <div className="mt-6 text-center">
                  <button
                    onClick={handleLogout}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center justify-center space-x-2 mx-auto"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Sign in as different user</span>
                  </button>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-neutral-400 text-sm">
              Basketball Development League
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
