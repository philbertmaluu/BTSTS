import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  Trophy,
  Target,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardBody } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  roles: Array<{
    id: number;
    name: string;
    description: string;
    is_active: boolean;
  }>;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  date_of_birth?: string;
}

interface UserStats {
  total_matches: number;
  matches_won: number;
  matches_lost: number;
  total_points: number;
  average_points: number;
  total_assists: number;
  total_rebounds: number;
  total_blocks: number;
  total_steals: number;
}

interface ActivityItem {
  id: string;
  type: "login" | "match" | "profile_update" | "role_change";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    date_of_birth: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
      generateActivities();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // For now, we'll use the user data from context
      // In a real app, you'd fetch detailed profile from API
      const userProfile: UserProfile = {
        ...user!,
        is_active: user!.is_active ?? true,
        phone: "+255 123 456 789",
        bio: "Passionate basketball enthusiast and league administrator. Dedicated to promoting the sport in Dar es Salaam.",
        location: "Dar es Salaam, Tanzania",
        date_of_birth: "1990-05-15",
      };

      setProfile(userProfile);
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
        location: userProfile.location || "",
        date_of_birth: userProfile.date_of_birth || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Mock stats for now - in real app, fetch from API
      const mockStats: UserStats = {
        total_matches: 45,
        matches_won: 32,
        matches_lost: 13,
        total_points: 1247,
        average_points: 27.7,
        total_assists: 89,
        total_rebounds: 156,
        total_blocks: 23,
        total_steals: 67,
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const generateActivities = () => {
    const mockActivities: ActivityItem[] = [
      {
        id: "1",
        type: "login",
        title: "Logged in",
        description: "Successfully logged into your account",
        timestamp: new Date().toISOString(),
        icon: <User size={16} />,
      },
      {
        id: "2",
        type: "match",
        title: "Match Result Updated",
        description: "Updated final score for Lakers vs Celtics match",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icon: <Trophy size={16} />,
      },
      {
        id: "3",
        type: "profile_update",
        title: "Profile Updated",
        description: "Updated your profile information",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        icon: <Edit size={16} />,
      },
      {
        id: "4",
        type: "role_change",
        title: "Role Assigned",
        description: "Assigned as League Administrator",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        icon: <Shield size={16} />,
      },
    ];
    setActivities(mockActivities);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.current_password) {
      newErrors.current_password = "Current password is required";
    }

    if (!passwordData.new_password) {
      newErrors.new_password = "New password is required";
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    }

    if (!passwordData.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // In real app, make API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setProfile((prev) => (prev ? { ...prev, ...formData } : null));
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setPasswordSaving(true);
    try {
      // In real app, make API call to change password
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setShowPasswordForm(false);
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login":
        return "text-blue-600 dark:text-blue-400";
      case "match":
        return "text-green-600 dark:text-green-400";
      case "profile_update":
        return "text-purple-600 dark:text-purple-400";
      case "role_change":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-neutral-600 dark:text-neutral-400";
    }
  };

  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                Profile not found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Unable to load your profile information
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          Profile not found
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Unable to load your profile information
        </p>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Profile
                </h5>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                  Manage your account and view your activity
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(true)}
                  leftIcon={<Settings size={16} />}
                >
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={16} />}
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardBody className="p-6">
                  <div className="text-center mb-6">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-neutral-700 shadow-lg">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          profile.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-600 transition-colors">
                        <Camera size={16} />
                      </button>
                    </div>

                    {/* Name and Status */}
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      {profile.name}
                    </h2>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          profile.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {profile.is_active ? "Active" : "Inactive"}
                      </div>
                      {/* <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {profile.roles[0]?.name || "User"}
                      </div> */}
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                  {/* Quick Stats */}
                  {stats && (
                    <div className="space-y-4 mb-6">
                      <div className="text-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {profile.roles[0]?.name || "User"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="text-neutral-400" size={16} />
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {profile.email}
                      </span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <User className="text-neutral-400" size={16} />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {profile.phone}
                        </span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Target className="text-neutral-400" size={16} />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {profile.location}
                        </span>
                      </div>
                    )}
                    {profile.date_of_birth && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Calendar className="text-neutral-400" size={16} />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {formatDate(profile.date_of_birth)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Form */}
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                      Profile Information
                    </h3>
                    {!editing ? (
                      <Button
                        variant="outline"
                        onClick={() => setEditing(true)}
                        leftIcon={<Edit size={16} />}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="primary"
                          onClick={handleSaveProfile}
                          leftIcon={<Save size={16} />}
                          isLoading={saving}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              name: profile.name,
                              email: profile.email,
                              phone: profile.phone || "",
                              bio: profile.bio || "",
                              location: profile.location || "",
                              date_of_birth: profile.date_of_birth || "",
                            });
                            setErrors({});
                          }}
                          leftIcon={<X size={16} />}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={!editing}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={!editing}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Phone Number
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={!editing}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            date_of_birth: e.target.value,
                          })
                        }
                        disabled={!editing}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Location
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                        disabled={!editing}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        disabled={!editing}
                        rows={4}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Change Password
              </h2>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                  });
                  setPasswordErrors({});
                }}
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current_password: e.target.value,
                      })
                    }
                    className={
                      passwordErrors.current_password ? "border-red-500" : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {passwordErrors.current_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.current_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password: e.target.value,
                      })
                    }
                    className={
                      passwordErrors.new_password ? "border-red-500" : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.new_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.new_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm_password: e.target.value,
                      })
                    }
                    className={
                      passwordErrors.confirm_password ? "border-red-500" : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {passwordErrors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.confirm_password}
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex-1"
                >
                  {passwordSaving ? "Changing..." : "Change Password"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      current_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                    setPasswordErrors({});
                  }}
                  disabled={passwordSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};
