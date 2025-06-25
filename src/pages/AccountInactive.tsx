import React from "react";
import { motion } from "framer-motion";
import {
  UserX,
  Clock,
  Mail,
  Phone,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import toast, { Toaster } from "react-hot-toast";

interface AccountStatus {
  status: "pending" | "approved" | "rejected" | "deactivated";
  reason?: string;
  deactivatedAt?: string;
  deactivatedBy?: string;
}

export const AccountInactive: React.FC = () => {
  const { user, logout } = useAuth();

  // Get account status from user data
  const accountStatus: AccountStatus = {
    status:
      (user?.status as "pending" | "approved" | "rejected" | "deactivated") ||
      "pending",
    reason:
      user?.status === "pending"
        ? "Your account is currently under review by our administrators."
        : user?.status === "rejected"
        ? "Your account application has been rejected."
        : user?.status === "deactivated"
        ? "Your account has been deactivated by an administrator."
        : "Your account status is currently being reviewed.",
    deactivatedAt: user?.deactivated_at || undefined,
    deactivatedBy: user?.deactivated_by?.toString() || undefined,
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const handleRefresh = () => {
    // In real app, this would check the account status from API
    toast.success("Checking account status...");
    // You could implement a polling mechanism here
  };

  const handleContactSupport = () => {
    // In real app, this would open contact form or redirect to support
    toast.success("Redirecting to support...");
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock size={24} className="text-yellow-500" />,
          title: "Account Pending Approval",
          description:
            "Your account is currently under review by our administrators.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
        };
      case "rejected":
        return {
          icon: <XCircle size={24} className="text-red-500" />,
          title: "Account Rejected",
          description: "Your account application has been rejected.",
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
        };
      case "deactivated":
        return {
          icon: <UserX size={24} className="text-red-500" />,
          title: "Account Deactivated",
          description: "Your account has been deactivated by an administrator.",
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
        };
      default:
        return {
          icon: <AlertCircle size={24} className="text-gray-500" />,
          title: "Account Status Unknown",
          description: "Unable to determine your account status.",
          color: "text-gray-600",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800",
        };
    }
  };

  const statusInfo = getStatusInfo(accountStatus.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-2xl border-0">
              <CardBody className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <UserX
                        size={32}
                        className="text-primary-600 dark:text-primary-400"
                      />
                    )}
                  </motion.div>

                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    Welcome back, {user?.name || "User"}!
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                {/* Status Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`mb-8 p-6 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{statusInfo.icon}</div>
                    <div className="flex-1">
                      <h2
                        className={`text-lg font-semibold ${statusInfo.color} mb-2`}
                      >
                        {statusInfo.title}
                      </h2>
                      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                        {statusInfo.description}
                      </p>

                      {accountStatus.reason && (
                        <div className="bg-white dark:bg-neutral-800 rounded-md p-3 mb-4">
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            <strong>Reason:</strong> {accountStatus.reason}
                          </p>
                        </div>
                      )}

                      {accountStatus.deactivatedAt && (
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          <p>
                            <strong>Deactivated:</strong>{" "}
                            {formatDate(accountStatus.deactivatedAt)}
                          </p>
                          {accountStatus.deactivatedBy && (
                            <p>
                              <strong>By:</strong> {accountStatus.deactivatedBy}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* What You Can Do */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                    What you can do:
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0"
                      />
                      <span>
                        Wait for administrator approval (usually within 24-48
                        hours)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0"
                      />
                      <span>
                        Contact support if you need immediate assistance
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0"
                      />
                      <span>
                        Check back later to see if your status has changed
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="flex-1"
                    leftIcon={<RefreshCw size={16} />}
                  >
                    Check Status
                  </Button>

                  <Button
                    onClick={handleContactSupport}
                    variant="outline"
                    className="flex-1"
                    leftIcon={<Mail size={16} />}
                  >
                    Contact Support
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="flex-1"
                    leftIcon={<LogOut size={16} />}
                  >
                    Sign Out
                  </Button>
                </motion.div>

                {/* Support Information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700"
                >
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                      Need immediate help?
                    </h4>
                    <div className="flex items-center justify-center space-x-6 text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} />
                        <span>support@basketballdsm.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={14} />
                        <span>+255 680 003 132</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mt-8"
          >
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Basketball Dar es salaam League
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
