import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Search, User, Mail, X } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { get, post, put, del } from "../../api/baseApi";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  status: "pending" | "approved" | "rejected";
  is_active: boolean;
  deactivation_reason?: string | null;
  deactivated_at?: string | null;
  deactivated_by?: number | null;
  avatar?: string;
  roles: {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    pivot: {
      user_id: number;
      role_id: number;
    };
  }[];
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role_ids: number[];
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  role_ids?: string;
}

interface PaginatedApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface CreateUserResponse {
  success: boolean;
  message: string;
  data?: User;
  errors?: Record<string, string[]>;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    role_ids: [],
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await get<PaginatedApiResponse>("/users");

      // Handle the new API response structure with pagination
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setUsers(response.data.data);
      } else if (response.success && Array.isArray(response.data)) {
        // Fallback for non-paginated response
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        setUsers(response);
      } else {
        console.error("Unexpected API response format:", response);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await get<Role[]>("/roles");
      if (Array.isArray(response)) {
        setRoles(response);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!editingUser && !formData.password) {
      errors.password = "Password is required";
    }

    if (formData.role_ids.length === 0) {
      errors.role_ids = "At least one role is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const submitData: Omit<CreateUserData, "password"> & {
        password?: string;
      } = { ...formData };

      // For editing, don't send password if it's empty
      if (editingUser && !submitData.password) {
        delete submitData.password;
      }

      let response;
      if (editingUser) {
        response = await put<CreateUserResponse>(
          `/users/${editingUser.id}`,
          submitData
        );
      } else {
        response = await post<CreateUserResponse>("/users", submitData);
      }

      if (response.success) {
        toast.success(
          editingUser
            ? "User updated successfully"
            : "User created successfully"
        );
        setShowAddModal(false);
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          role_ids: [],
        });
        setFormErrors({});
        await fetchUsers();
      } else {
        toast.error(response.message || "Failed to save user");
      }
    } catch (error: unknown) {
      console.error("Error saving user:", error);

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: {
            data?: { errors?: Record<string, string[]>; message?: string };
          };
        };

        if (apiError.response?.data?.errors) {
          // Handle validation errors
          const validationErrors = apiError.response.data.errors;
          Object.keys(validationErrors).forEach((key) => {
            toast.error(validationErrors[key][0]);
          });
        } else {
          toast.error(
            apiError.response?.data?.message || "Failed to save user"
          );
        }
      } else {
        toast.error("Failed to save user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateUserData,
    value: string | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await del(`/users/${userId}`);
        await fetchUsers();
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      await post(`/users/${userId}/approve`);
      await fetchUsers();
      toast.success("User approved successfully");
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  const handleRejectUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to reject this user?")) {
      try {
        await post(`/users/${userId}/reject`);
        await fetchUsers();
        toast.success("User rejected successfully");
      } catch (error) {
        console.error("Error rejecting user:", error);
        toast.error("Failed to reject user");
      }
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      await post(`/users/${userId}/activate`);
      await fetchUsers();
      toast.success("User activated successfully");
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        await post(`/users/${userId}/deactivate`);
        await fetchUsers();
        toast.success("User deactivated successfully");
      } catch (error) {
        console.error("Error deactivating user:", error);
        toast.error("Failed to deactivate user");
      }
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password
      role_ids: user.roles.map((role) => role.id),
    });
    setShowAddModal(true);
  };

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.roles.some(
        (role) => role.name.toLowerCase() === roleFilter.toLowerCase()
      );
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get status display info
  const getStatusInfo = (user: User) => {
    switch (user.status) {
      case "pending":
        return {
          label: "Pending",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        };
      case "approved":
        return {
          label: "Approved",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        };
      case "rejected":
        return {
          label: "Rejected",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        };
      default:
        return {
          label: "Unknown",
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading users...
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Manage Users
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Create, edit, and manage user accounts and permissions
              </p>
            </div>
            {/* <Button
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus size={16} />}
            >
              Add User
            </Button> */}
          </div>

          {/* Filters */}
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={16} />}
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {/* Users Table */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6">
              <h2 className="text-xl font-bold">
                Users ({filteredUsers.length})
              </h2>
              <p className="text-neutral-300 text-sm mt-1">
                Basketball Development League Users
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Active
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredUsers.map((user, index) => {
                    const statusInfo = getStatusInfo(user);
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.avatar ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                                  src={user.avatar}
                                  alt={user.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                                  <User
                                    size={16}
                                    className="text-primary-600 dark:text-primary-400"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail
                              size={14}
                              className="text-neutral-500 dark:text-neutral-400 mr-2"
                            />
                            <div className="text-sm text-neutral-900 dark:text-white">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <span
                                key={role.id}
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  role.is_active
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                }`}
                              >
                                {role.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {formatDate(user.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {/* Approval/Rejection buttons for pending users */}
                            {user.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApproveUser(user.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {/* Activation/Deactivation buttons for approved users */}

                            {/*if user role is admin do not show deactivate button */}
                            {user.status === "approved" &&
                              !user.roles.some(
                                (role) => role.name === "Admin"
                              ) && (
                                <>
                                  {user.is_active ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleDeactivateUser(user.id)
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      Deactivate
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleActivateUser(user.id)
                                      }
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      Activate
                                    </Button>
                                  )}
                                </>
                              )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(user)}
                              leftIcon={<Edit size={14} />}
                            >
                              Edit
                            </Button>
                            {/*if user role is admin do not show delete button */}
                            {user.status === "approved" &&
                              !user.roles.some(
                                (role) => role.name === "Admin"
                              ) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  leftIcon={<Trash2 size={14} />}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </Button>
                              )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No users found matching your criteria.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Add/Edit User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {editingUser ? "Edit User" : "Add New User"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      role_ids: [],
                    });
                    setFormErrors({});
                  }}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {editingUser
                      ? "New Password (leave blank to keep current)"
                      : "Password *"}
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder={
                      editingUser ? "Enter new password" : "Enter password"
                    }
                    className={formErrors.password ? "border-red-500" : ""}
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Roles *
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {roles.map((role) => (
                      <label
                        key={role.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.role_ids.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange("role_ids", [
                                ...formData.role_ids,
                                role.id,
                              ]);
                            } else {
                              handleInputChange(
                                "role_ids",
                                formData.role_ids.filter((id) => id !== role.id)
                              );
                            }
                          }}
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {role.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formErrors.role_ids && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.role_ids}
                    </p>
                  )}
                </div> */}

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting
                      ? editingUser
                        ? "Updating..."
                        : "Creating..."
                      : editingUser
                      ? "Update User"
                      : "Create User"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingUser(null);
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        role_ids: [],
                      });
                      setFormErrors({});
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};
