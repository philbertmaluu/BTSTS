import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { get, post, put, del } from "../../api/baseApi";
import toast, { Toaster } from "react-hot-toast";

interface Coach {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Team {
  id: number;
  name: string;
  logo: string | null;
  coach_id: number;
  created_at: string;
  updated_at: string;
  coach: Coach;
  logo_url?: string;
}

interface ApiResponse {
  success: boolean;
  data: Team[];
}

interface CreateTeamData {
  name: string;
  logo: File | null;
  coach_id: number;
}

interface CreateTeamResponse {
  success: boolean;
  message: string;
  data?: Team;
  errors?: Record<string, string[]>;
}

export const TeamsPage2: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<CreateTeamData>({
    name: "",
    logo: null,
    coach_id: 1,
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    logo?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await get<ApiResponse>("/teams");

      // Handle the API response structure
      if (response.success && Array.isArray(response.data)) {
        setTeams(response.data);
      } else {
        console.error("Unexpected API response format:", response);
        setTeams([]);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await del(`/teams/${teamId}`);
        await fetchTeams();
        toast.success("Team deleted successfully");
      } catch (error) {
        console.error("Error deleting team:", error);
        toast.error("Failed to delete team");
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; logo?: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Team name is required";
    }

    if (!formData.logo) {
      errors.logo = "Logo is required";
    } else {
      // Validate file type based on backend requirements
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(formData.logo.type)) {
        errors.logo =
          "Please select a valid image file (JPEG, PNG, GIF, or SVG)";
      }

      // Validate file size (2MB limit as per backend)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (formData.logo.size > maxSize) {
        errors.logo = "File size must be less than 2MB";
      }
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
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("coach_id", formData.coach_id.toString());

      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
        console.log(
          "Appending logo file:",
          formData.logo.name,
          formData.logo.size,
          formData.logo.type
        );
      }

      // Log FormData contents for debugging
      console.log("FormData entries:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(
          "FormData entry:",
          key,
          value instanceof File
            ? `File: ${value.name} (${value.size} bytes)`
            : value
        );
      }

      console.log("Sending request to /teams with FormData...");

      let response;
      if (editingTeam) {
        // Use PUT for updates
        response = await put<CreateTeamResponse>(
          `/teams/${editingTeam.id}`,
          formDataToSend
        );
      } else {
        // Use POST for creating new teams
        response = await post<CreateTeamResponse>("/teams", formDataToSend);
      }

      if (response.success) {
        toast.success(
          editingTeam
            ? "Team updated successfully"
            : "Team created successfully"
        );
        setShowAddModal(false);
        setEditingTeam(null);
        setFormData({ name: "", logo: null, coach_id: 1 });
        setFormErrors({});
        // Reset file input
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        await fetchTeams();
      } else {
        toast.error(
          response.message ||
            (editingTeam ? "Failed to update team" : "Failed to create team")
        );
      }
    } catch (error: unknown) {
      console.error("Error creating team:", error);

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
            apiError.response?.data?.message || "Failed to create team"
          );
        }
      } else {
        toast.error("Failed to create team");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateTeamData,
    value: string | number | File
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (field === "name" && formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const filteredTeams = (teams || []).filter((team) => {
    const matchesSearch = team.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading teams...
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
                Manage Teams
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                View and manage basketball teams
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus size={16} />}
            >
              Add Team
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={16} />}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Teams Table */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6">
              <h2 className="text-xl font-bold">
                Teams ({filteredTeams.length})
              </h2>
              <p className="text-neutral-300 text-sm mt-1">
                Basketball Development League Teams
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredTeams.map((team, index) => (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {team.logo_url ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                                src={team.logo_url}
                                alt={team.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                                  {team.name[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                              {team.name}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              ID: {team.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {formatDate(team.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTeam(team);
                              setFormData({
                                name: team.name,
                                logo: null,
                                coach_id: team.coach_id,
                              });
                              setShowAddModal(true);
                            }}
                            leftIcon={<Edit size={14} />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTeam(team.id)}
                            leftIcon={<Trash2 size={14} />}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTeams.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No teams found matching your criteria.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Add Team Modal */}
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
                  {editingTeam ? "Edit Team" : "Add New Team"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTeam(null);
                    setFormData({ name: "", logo: null, coach_id: 1 });
                    setFormErrors({});
                    // Reset file input
                    const fileInput = document.querySelector(
                      'input[type="file"]'
                    ) as HTMLInputElement;
                    if (fileInput) fileInput.value = "";
                  }}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Team Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter team name"
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
                    Logo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      console.log(e.target.files);
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        handleInputChange("logo", file);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.logo
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                  />
                  {formErrors.logo && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.logo}
                    </p>
                  )}
                  {formData.logo && (
                    <div className="mt-2 p-2 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Selected: {formData.logo.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        Size: {(formData.logo.size / 1024).toFixed(1)} KB |
                        Type: {formData.logo.type}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting
                      ? editingTeam
                        ? "Updating..."
                        : "Creating..."
                      : editingTeam
                      ? "Update Team"
                      : "Create Team"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingTeam(null);
                      setFormData({ name: "", logo: null, coach_id: 1 });
                      setFormErrors({});
                      // Reset file input
                      const fileInput = document.querySelector(
                        'input[type="file"]'
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
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
