import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        navigate('/dashboard');
      } catch (err) {
        // Error is handled by the AuthContext
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-neutral-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Create an Account</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Join HoopStats and start tracking basketball statistics</p>
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
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={formErrors.firstName}
                  leftIcon={<User size={18} />}
                  required
                />
                
                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={formErrors.lastName}
                  leftIcon={<User size={18} />}
                  required
                />
              </div>
              
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                leftIcon={<Mail size={18} />}
                required
              />
              
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                leftIcon={<Lock size={18} />}
                helperText="Password must be at least 6 characters"
                required
              />
              
              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formErrors.confirmPassword}
                leftIcon={<Lock size={18} />}
                required
              />
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
              </Button>
            </form>
          </CardBody>
          
          <CardFooter className="text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};