import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
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

      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 relative">
        {/* Back to Home Button - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-6 left-6 z-50"
        >
          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500 dark:hover:border-primary-400 transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Login Form */}
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Logo */}
            <div className="text-center mb-8">
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
