import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, X, MapPin, Users } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getVenues, createVenue, updateVenue, deleteVenue } from "../../api/venue";
import { Venue } from "../../types";
import toast, { Toaster } from "react-hot-toast";

interface CreateVenueData {
  name: string;
  location: string;
  capacity: number;
}

export const VenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState<CreateVenueData>({
    name: "",
    location: "",
    capacity: 0,
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    location?: string;
    capacity?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const data = await getVenues();
      setVenues(data);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setVenues([]);
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVenue = async (venueId: number) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await deleteVenue(venueId);
        await fetchVenues();
        toast.success("Venue deleted successfully");
      } catch (error) {
        console.error("Error deleting venue:", error);
        toast.error("Failed to delete venue");
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; location?: string; capacity?: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Venue name is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (formData.capacity <= 0) {
      errors.capacity = "Capacity must be greater than 0";
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
      if (editingVenue) {
        await updateVenue(editingVenue.id, formData);
        toast.success("Venue updated successfully");
      } else {
        await createVenue(formData);
        toast.success("Venue created successfully");
      }

      setShowAddModal(false);
      setEditingVenue(null);
      setFormData({ name: "", location: "", capacity: 0 });
      setFormErrors({});
      await fetchVenues();
    } catch (error: unknown) {
      console.error("Error saving venue:", error);

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
            apiError.response?.data?.message || "Failed to save venue"
          );
        }
      } else {
        toast.error("Failed to save venue");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateVenueData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase());
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
          Loading venues...
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
                Manage Venues
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                View and manage basketball venues
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus size={16} />}
            >
              Add Venue
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search venues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={16} />}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Venues Table */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6">
              <h2 className="text-xl font-bold">
                Venues ({filteredVenues.length})
              </h2>
              <p className="text-neutral-300 text-sm mt-1">
                Basketball Venues and Locations
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Capacity
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
                  {filteredVenues.map((venue, index) => (
                    <motion.tr
                      key={venue.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <MapPin size={16} className="text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                              {venue.name}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              ID: {venue.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {venue.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <Users size={14} className="text-neutral-400 mr-1" />
                          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {venue.capacity.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {formatDate(venue.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingVenue(venue);
                              setFormData({
                                name: venue.name,
                                location: venue.location,
                                capacity: venue.capacity,
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
                            onClick={() => handleDeleteVenue(venue.id)}
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

            {filteredVenues.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No venues found matching your criteria.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Add/Edit Venue Modal */}
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
                  {editingVenue ? "Edit Venue" : "Add New Venue"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVenue(null);
                    setFormData({ name: "", location: "", capacity: 0 });
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
                    Venue Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter venue name"
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
                    Location *
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter venue location"
                    className={formErrors.location ? "border-red-500" : ""}
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Capacity *
                  </label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                    placeholder="Enter venue capacity"
                    min="1"
                    className={formErrors.capacity ? "border-red-500" : ""}
                  />
                  {formErrors.capacity && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.capacity}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting
                      ? editingVenue
                        ? "Updating..."
                        : "Creating..."
                      : editingVenue
                      ? "Update Venue"
                      : "Create Venue"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingVenue(null);
                      setFormData({ name: "", location: "", capacity: 0 });
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