import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { get, post, put, del } from "../../api/baseApi";
import toast, { Toaster } from "react-hot-toast";

interface Fixture {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_team: {
    id: number;
    name: string;
    logo?: string;
    logo_url?: string;
  };
  away_team: {
    id: number;
    name: string;
    logo?: string;
    logo_url?: string;
  };
  fixture_date: string;
  fixture_time: string;
  venue: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  season_id: number;
  statistician_id?: number;
  created_at: string;
  updated_at: string;
}

interface Team {
  id: number;
  name: string;
  logo?: string;
  logo_url?: string;
}

interface Statistician {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  is_active: boolean;
  deactivation_reason: string | null;
  deactivated_at: string | null;
  deactivated_by: string | null;
  created_at: string;
  updated_at: string;
  roles: Array<{
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    pivot: {
      user_id: number;
      role_id: number;
    };
  }>;
}

interface CreateFixtureData {
  home_team_id: string | number;
  away_team_id: string | number;
  fixture_date: string;
  fixture_time: string;
  venue: string;
  season_id: number;
  statician_id?: string | number;
}

interface ApiResponse {
  success: boolean;
  data: Fixture[];
}

interface CreateFixtureResponse {
  success: boolean;
  message: string;
  data?: Fixture;
  errors?: Record<string, string[]>;
}

interface StatisticiansResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Statistician[];
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

export const FixturesPage: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [statisticians, setStatisticians] = useState<Statistician[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [statisticiansLoading, setStatisticiansLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [formData, setFormData] = useState<CreateFixtureData>({
    home_team_id: "",
    away_team_id: "",
    fixture_date: "",
    fixture_time: "",
    venue: "",
    season_id: 1, // Default season
    statician_id: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<CreateFixtureData>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFixtures();
    fetchTeams();
    fetchStatisticians();
  }, []);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      const response = await get<ApiResponse>("/fixtures");

      // Handle the API response structure
      if (response.success && Array.isArray(response.data)) {
        setFixtures(response.data);
      } else if (Array.isArray(response)) {
        setFixtures(response);
      } else {
        console.error("Unexpected API response format:", response);
        setFixtures([]);
      }
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      setFixtures([]);
      toast.error("Failed to load fixtures");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);
      const response = await get<Team[]>("/teams");
      // Handle different response formats
      if (Array.isArray(response)) {
        setTeams(response);
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        // Handle wrapped response format
        const responseData = response as { data: Team[] };
        setTeams(Array.isArray(responseData.data) ? responseData.data : []);
      } else {
        console.error("Unexpected teams response format:", response);
        setTeams([]);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
      toast.error("Failed to load teams");
    } finally {
      setTeamsLoading(false);
    }
  };

  const fetchStatisticians = async () => {
    try {
      setStatisticiansLoading(true);
      const response = await get<StatisticiansResponse>("/users");

      if (
        response.success &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        // Filter users who have the "Statistician" role and are active
        const statisticianUsers = response.data.data.filter(
          (user) =>
            user.is_active &&
            user.roles.some(
              (role: { name: string }) => role?.name === "Statistician"
            )
        );
        setStatisticians(statisticianUsers);
      } else if (Array.isArray(response)) {
        // Handle direct array response (fallback)
        const statisticianUsers = response.filter(
          (user) =>
            user.is_active &&
            user.roles.some(
              (role: { name: string }) => role?.name === "Statistician"
            )
        );
        setStatisticians(statisticianUsers);
      } else {
        console.error("Unexpected statisticians response format:", response);
        setStatisticians([]);
      }
    } catch (error) {
      console.error("Error fetching statisticians:", error);
      setStatisticians([]);
      toast.error("Failed to load statisticians");
    } finally {
      setStatisticiansLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CreateFixtureData> = {};

    if (!formData.home_team_id) {
      errors.home_team_id = "Home team is required";
    }

    if (!formData.away_team_id) {
      errors.away_team_id = "Away team is required";
    }

    if (formData.home_team_id === formData.away_team_id) {
      errors.away_team_id = "Home and away teams must be different";
    }

    if (!formData.fixture_date) {
      errors.fixture_date = "Fixture date is required";
    }

    if (!formData.fixture_time) {
      errors.fixture_time = "Fixture time is required";
    }

    if (!formData.venue.trim()) {
      errors.venue = "Venue is required";
    }

    if (!formData.statician_id) {
      errors.statician_id = "Statistician is required";
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
      // Convert IDs to numbers for API
      const submitData = {
        ...formData,
        home_team_id:
          typeof formData.home_team_id === "string"
            ? parseInt(formData.home_team_id) || 0
            : formData.home_team_id,
        away_team_id:
          typeof formData.away_team_id === "string"
            ? parseInt(formData.away_team_id) || 0
            : formData.away_team_id,
        statician_id:
          typeof formData.statician_id === "string"
            ? parseInt(formData.statician_id) || 0
            : formData.statician_id,
      };

      let response;
      if (editingFixture) {
        response = await put<CreateFixtureResponse>(
          `/fixtures/${editingFixture.id}`,
          submitData
        );
      } else {
        response = await post<CreateFixtureResponse>("/fixtures", submitData);
      }

      if (response.success) {
        toast.success(
          editingFixture
            ? "Fixture updated successfully"
            : "Fixture created successfully"
        );
        setShowAddModal(false);
        setEditingFixture(null);
        setFormData({
          home_team_id: "",
          away_team_id: "",
          fixture_date: "",
          fixture_time: "",
          venue: "",
          season_id: 1,
          statician_id: "",
        });
        setFormErrors({});
        await fetchFixtures();
      } else {
        toast.error(response.message || "Failed to save fixture");
      }
    } catch (error: unknown) {
      console.error("Error saving fixture:", error);

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
            apiError.response?.data?.message || "Failed to save fixture"
          );
        }
      } else {
        toast.error("Failed to save fixture");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateFixtureData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDeleteFixture = async (fixtureId: number) => {
    if (window.confirm("Are you sure you want to delete this fixture?")) {
      try {
        await del(`/fixtures/${fixtureId}`);
        await fetchFixtures();
        toast.success("Fixture deleted successfully");
      } catch (error) {
        console.error("Error deleting fixture:", error);
        toast.error("Failed to delete fixture");
      }
    }
  };

  const openEditModal = (fixture: Fixture) => {
    setEditingFixture(fixture);
    const scheduledDate = new Date(fixture.fixture_date);
    setFormData({
      home_team_id: fixture.home_team_id,
      away_team_id: fixture.away_team_id,
      fixture_date: scheduledDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      fixture_time: scheduledDate.toTimeString().substring(0, 5), // Format as HH:MM
      venue: fixture.venue,
      season_id: fixture.season_id,
      statician_id: fixture.statistician_id || "",
    });
    setShowAddModal(true);
  };

  const filteredFixtures = (fixtures || []).filter((fixture) => {
    const matchesSearch =
      fixture.home_team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fixture.away_team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fixture.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || fixture.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "in progress":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);

    if (timeString) {
      return `${formattedDate} at ${timeString}`;
    }

    return formattedDate;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading fixtures...
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
                Manage Fixtures
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Create, edit, and manage match fixtures
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus size={16} />}
            >
              Add Fixture
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search fixtures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={16} />}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {/* Fixtures Table */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6">
              <h2 className="text-xl font-bold">
                Fixtures ({filteredFixtures.length})
              </h2>
              <p className="text-neutral-300 text-sm mt-1">
                Basketball Development League Fixtures
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Match
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Venue
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
                  {filteredFixtures.map((fixture, index) => (
                    <motion.tr
                      key={fixture.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          {/* Home Team */}
                          <div className="flex items-center space-x-3">
                            {fixture.home_team.logo_url ? (
                              <img
                                src={fixture.home_team.logo_url}
                                alt={fixture.home_team.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                                  {fixture.home_team.name[0]}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {fixture.home_team.name}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                Home
                              </div>
                            </div>
                          </div>

                          {/* VS */}
                          <div className="text-neutral-500 dark:text-neutral-400 font-semibold text-sm">
                            VS
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {fixture.away_team.name}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                Away
                              </div>
                            </div>
                            {fixture.away_team.logo_url ? (
                              <img
                                src={fixture.away_team.logo_url}
                                alt={fixture.away_team.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                                  {fixture.away_team.name[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {formatDate(
                            fixture.fixture_date,
                            fixture.fixture_time
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {fixture.venue}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            fixture.status
                          )}`}
                        >
                          {fixture.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(fixture)}
                            leftIcon={<Edit size={14} />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFixture(fixture.id)}
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

            {filteredFixtures.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No fixtures found matching your criteria.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Add/Edit Fixture Modal */}
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
                  {editingFixture ? "Edit Fixture" : "Add New Fixture"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFixture(null);
                    setFormData({
                      home_team_id: "",
                      away_team_id: "",
                      fixture_date: "",
                      fixture_time: "",
                      venue: "",
                      season_id: 1,
                      statician_id: "",
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
                    Home Team *
                  </label>
                  <select
                    value={formData.home_team_id || ""}
                    onChange={(e) =>
                      handleInputChange("home_team_id", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.home_team_id
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                    disabled={teamsLoading}
                  >
                    <option value="">
                      {teamsLoading ? "Loading teams..." : "Select Home Team"}
                    </option>
                    {teams.length === 0 && !teamsLoading && (
                      <option value="" disabled>
                        No teams available
                      </option>
                    )}
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.home_team_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.home_team_id}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Away Team *
                  </label>
                  <select
                    value={formData.away_team_id || ""}
                    onChange={(e) =>
                      handleInputChange("away_team_id", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.away_team_id
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                    disabled={teamsLoading}
                  >
                    <option value="">
                      {teamsLoading ? "Loading teams..." : "Select Away Team"}
                    </option>
                    {teams.length === 0 && !teamsLoading && (
                      <option value="" disabled>
                        No teams available
                      </option>
                    )}
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.away_team_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.away_team_id}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Fixture Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.fixture_date}
                    onChange={(e) =>
                      handleInputChange("fixture_date", e.target.value)
                    }
                    className={formErrors.fixture_date ? "border-red-500" : ""}
                  />
                  {formErrors.fixture_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.fixture_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Fixture Time *
                  </label>
                  <Input
                    type="time"
                    value={formData.fixture_time}
                    onChange={(e) =>
                      handleInputChange("fixture_time", e.target.value)
                    }
                    className={formErrors.fixture_time ? "border-red-500" : ""}
                  />
                  {formErrors.fixture_time && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.fixture_time}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Venue *
                  </label>
                  <Input
                    value={formData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    placeholder="Enter venue"
                    className={formErrors.venue ? "border-red-500" : ""}
                  />
                  {formErrors.venue && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.venue}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Statistician *
                  </label>
                  <select
                    value={formData.statician_id || ""}
                    onChange={(e) =>
                      handleInputChange("statician_id", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.statician_id
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                    disabled={statisticiansLoading}
                  >
                    <option value="">
                      {statisticiansLoading
                        ? "Loading statisticians..."
                        : "Select Statistician"}
                    </option>
                    {statisticians.length === 0 && !statisticiansLoading && (
                      <option value="" disabled>
                        No statisticians available
                      </option>
                    )}
                    {statisticians.map((statistician) => (
                      <option key={statistician.id} value={statistician.id}>
                        {statistician.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.statician_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.statician_id}
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
                      ? editingFixture
                        ? "Updating..."
                        : "Creating..."
                      : editingFixture
                      ? "Update Fixture"
                      : "Create Fixture"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingFixture(null);
                      setFormData({
                        home_team_id: "",
                        away_team_id: "",
                        fixture_date: "",
                        fixture_time: "",
                        venue: "",
                        season_id: 1,
                        statician_id: "",
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
