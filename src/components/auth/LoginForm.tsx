import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import toast, { Toaster } from "react-hot-toast";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await login(email, password);
        navigate("/dashboard");
      } catch (error: unknown) {
        // Show API response message using toast
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as {
            response?: { data?: { message?: string; success?: boolean } };
          };
          const message = apiError.response?.data?.message || "Login failed";
          const isSuccess = apiError.response?.data?.success;

          if (isSuccess === false) {
            // Show error toast for failed login attempts
            toast.error(message);
          } else {
            toast.error("Login failed. Please try again.");
          }
        } else {
          toast.error("Login failed. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
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
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-900 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.1),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,165,0,0.08),transparent_50%)]" />
        </div>

        {/* Back to Home Button - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-6 left-6 z-10"
        >
          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500 dark:hover:border-primary-400 transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Left Side - Branding (Hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 p-12 flex-col justify-center items-center text-white relative"
        >
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <img
                  src="/icons/icons8-basketball-100.png"
                  alt="BDL Logo"
                  className="w-16 h-16"
                />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl font-display font-bold mb-4"
            >
              Basketball Dar es Salaam League
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-white/90 mb-8 max-w-md mx-auto"
            >
              Join the most exciting basketball community in Tanzania
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center space-x-8 text-white/80"
            >
              <div className="text-center">
                <div className="text-3xl font-bold">7+</div>
                <div className="text-sm">Teams</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm">Players</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm">Matches</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4"
              >
                <img
                  src="/icons/icons8-basketball-100.png"
                  alt="BDL Logo"
                  className="w-10 h-10"
                />
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
                BDL
              </h2>
            </div>

            <Card className="border-2 border-neutral-200 dark:border-neutral-700">
              <CardHeader className="text-center pb-4">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  Welcome Back! 🏀
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Sign in to access your account
                </p>
              </CardHeader>

              <CardBody className="pt-2">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-error-50 dark:bg-error-900/30 text-error-600 dark:text-error-400 p-3 rounded-lg flex items-center gap-2 text-sm border border-error-200 dark:border-error-800"
                    >
                      <AlertCircle size={16} />
                      {error}
                    </motion.div>
                  )}

                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={formErrors.email}
                    leftIcon={<Mail size={18} />}
                    required
                  />

                  <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={formErrors.password}
                    leftIcon={<Lock size={18} />}
                    required
                  />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-neutral-700 dark:text-neutral-300"
                      >
                        Remember me
                      </label>
                    </div>

                    <Link
                      to="/forgot-password"
                      className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    size="lg"
                    isLoading={isLoading}
                  >
                    Sign In
                  </Button>
                </form>
              </CardBody>

              <CardFooter className="text-center border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-semibold"
                  >
                    Create Account
                  </Link>
                </p>
              </CardFooter>
            </Card>

            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center text-xs text-neutral-500 dark:text-neutral-500 mt-6"
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
