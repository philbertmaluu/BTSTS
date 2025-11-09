import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, X, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { get, post, put, del } from "../../api/baseApi";
import toast, { Toaster } from "react-hot-toast";

interface Season {
  id: number;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Season[];
}

interface CreateSeasonData {
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface CreateSeasonResponse {
  success: boolean;
  message: string;
  data?: Season;
  errors?: Record<string, string[]>;
}

export const SeasonsPage: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [formData, setFormData] = useState<CreateSeasonData>({
    name: "",
    year: new Date().getFullYear(),
    start_date: "",
    end_date: "",
    is_active: false,
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    year?: string;
    start_date?: string;
    end_date?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      const response = await get<ApiResponse>("/seasons");

      if (response.success && Array.isArray(response.data)) {
        setSeasons(response.data);
      } else {
        console.error("Unexpected API response format:", response);
        setSeasons([]);
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setSeasons([]);
      toast.error("Failed to load seasons");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeason = async (seasonId: number) => {
    if (window.confirm("Are you sure you want to delete this season?")) {
      try {
        await del(`/seasons/${seasonId}`);
        await fetchSeasons();
        toast.success("Season deleted successfully");
      } catch (error) {
        console.error("Error deleting season:", error);
        toast.error("Failed to delete season");
      }
    }
  };

  const handleSetActiveSeason = async (seasonId: number) => {
    try {
      const response = await put<CreateSeasonResponse>(
        `/seasons/${seasonId}`,
        { is_active: true }
      );

      if (response.success) {
        toast.success("Season set as active successfully");
        await fetchSeasons();
      } else {
        toast.error(response.message || "Failed to set season as active");
      }
    } catch (error) {
      console.error("Error setting active season:", error);
      toast.error("Failed to set season as active");
    }
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      year?: string;
      start_date?: string;
      end_date?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = "Season name is required";
    }

    if (!formData.year || formData.year < 2000 || formData.year > 2100) {
      errors.year = "Please enter a valid year";
    }

    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      errors.end_date = "End date is required";
    }

    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.start_date) >= new Date(formData.end_date)
    ) {
      errors.end_date = "End date must be after start date";
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
      let response;
      if (editingSeason) {
        response = await put<CreateSeasonResponse>(
          `/seasons/${editingSeason.id}`,
          formData
        );
      } else {
        response = await post<CreateSeasonResponse>("/seasons", formData);
      }

      if (response.success) {
        toast.success(
          editingSeason
            ? "Season updated successfully"
            : "Season created successfully"
        );
        setShowAddModal(false);
        setEditingSeason(null);
        setFormData({
          name: "",
          year: new Date().getFullYear(),
          start_date: "",
          end_date: "",
          is_active: false,
        });
        setFormErrors({});
        await fetchSeasons();
      } else {
        toast.error(
          response.message ||
            (editingSeason ? "Failed to update season" : "Failed to create season")
        );
      }
    } catch (error: unknown) {
      console.error("Error saving season:", error);
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: {
            data?: { errors?: Record<string, string[]>; message?: string };
          };
        };

        if (apiError.response?.data?.errors) {
          const validationErrors = apiError.response.data.errors;
          Object.keys(validationErrors).forEach((key) => {
            toast.error(validationErrors[key][0]);
          });
        } else {
          toast.error(
            apiError.response?.data?.message || "Failed to save season"
          );
        }
      } else {
        toast.error("Failed to save season");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateSeasonData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const filteredSeasons = (seasons || []).filter((season) => {
    const matchesSearch =
      season.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      season.year.toString().includes(searchTerm);
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
          Loading seasons...
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
                Manage Seasons
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                View and manage basketball seasons
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus size={16} />}
            >
              Add Season
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search seasons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={16} />}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Seasons Table */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-neutral-800 dark:to-neutral-900 text-white p-6">
              <h2 className="text-xl font-bold">
                Seasons ({filteredSeasons.length})
              </h2>
              <p className="text-white/90 dark:text-neutral-300 text-sm mt-1">
                Basketball Development League Seasons
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Season
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredSeasons.map((season, index) => (
                    <motion.tr
                      key={season.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 border-2 border-neutral-200 dark:border-neutral-700">
                            <Calendar className="text-primary-600 dark:text-primary-400" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                              {season.name}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              ID: {season.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {season.year}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {formatDate(season.start_date)} - {formatDate(season.end_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            season.is_active
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400"
                          }`}
                        >
                          {season.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {!season.is_active && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetActiveSeason(season.id)}
                              leftIcon={<CheckCircle2 size={14} />}
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            >
                              Set Active
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSeason(season);
                              setFormData({
                                name: season.name,
                                year: season.year,
                                start_date: season.start_date,
                                end_date: season.end_date,
                                is_active: season.is_active,
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
                            onClick={() => handleDeleteSeason(season.id)}
                            leftIcon={<Trash2 size={14} />}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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

            {filteredSeasons.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No seasons found matching your criteria.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Add/Edit Season Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {editingSeason ? "Edit Season" : "Add New Season"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSeason(null);
                    setFormData({
                      name: "",
                      year: new Date().getFullYear(),
                      start_date: "",
                      end_date: "",
                      is_active: false,
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
                    Season Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., BDL Season 2024/2025"
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
                    Year *
                  </label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      handleInputChange("year", parseInt(e.target.value))
                    }
                    placeholder="2024"
                    min="2000"
                    max="2100"
                    className={formErrors.year ? "border-red-500" : ""}
                  />
                  {formErrors.year && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.year}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      handleInputChange("start_date", e.target.value)
                    }
                    className={formErrors.start_date ? "border-red-500" : ""}
                  />
                  {formErrors.start_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.start_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      handleInputChange("end_date", e.target.value)
                    }
                    className={formErrors.end_date ? "border-red-500" : ""}
                  />
                  {formErrors.end_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.end_date}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      handleInputChange("is_active", e.target.checked)
                    }
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    Mark as Active Season
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting
                      ? editingSeason
                        ? "Updating..."
                        : "Creating..."
                      : editingSeason
                      ? "Update Season"
                      : "Create Season"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingSeason(null);
                      setFormData({
                        name: "",
                        year: new Date().getFullYear(),
                        start_date: "",
                        end_date: "",
                        is_active: false,
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

