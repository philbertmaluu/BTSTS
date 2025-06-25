import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle } from "lucide-react";
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

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-neutral-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Sign in to your account
              </p>
            </CardHeader>

            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-error-50 dark:bg-error-900/30 text-error-600 dark:text-error-400 p-3 rounded-md flex items-center gap-2 text-sm"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}

                <Input
                  type="email"
                  label="Email"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Sign In
                </Button>
              </form>
            </CardBody>

            <CardFooter className="text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};
