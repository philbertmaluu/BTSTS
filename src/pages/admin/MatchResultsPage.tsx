import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2, Search, X } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { get, del } from "../../api/baseApi";
import toast, { Toaster } from "react-hot-toast";

interface MatchResult {
  id: number;
  fixture_id: number;
  fixture: {
    id: number;
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
  };
  home_team_score: number;
  away_team_score: number;
  home_field_goals_made: number;
  home_field_goals_attempted: number;
  home_three_pointers_made: number;
  home_three_pointers_attempted: number;
  home_free_throws_made: number;
  home_free_throws_attempted: number;
  home_assists: number;
  home_rebounds_offensive: number;
  home_rebounds_defensive: number;
  home_rebounds_total: number;
  home_blocks: number;
  home_steals: number;
  home_turnovers: number;
  home_fouls: number;
  away_field_goals_made: number;
  away_field_goals_attempted: number;
  away_three_pointers_made: number;
  away_three_pointers_attempted: number;
  away_free_throws_made: number;
  away_free_throws_attempted: number;
  away_assists: number;
  away_rebounds_offensive: number;
  away_rebounds_defensive: number;
  away_rebounds_total: number;
  away_blocks: number;
  away_steals: number;
  away_turnovers: number;
  away_fouls: number;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  game_start_time?: string;
  game_end_time?: string;
  winner?: "home" | "away";
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: MatchResult[];
}

export const MatchResultsPage: React.FC = () => {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedResult, setSelectedResult] = useState<MatchResult | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchMatchResults();
  }, []);

  const fetchMatchResults = async () => {
    try {
      setLoading(true);
      const response = await get<ApiResponse>("/match-results");

      // Handle the API response structure
      if (response.success && Array.isArray(response.data)) {
        setMatchResults(response.data);
      } else if (Array.isArray(response)) {
        setMatchResults(response);
      } else {
        console.error("Unexpected API response format:", response);
        setMatchResults([]);
      }
    } catch (error) {
      console.error("Error fetching match results:", error);
      setMatchResults([]);
      toast.error("Failed to load match results");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResult = async (resultId: number) => {
    if (window.confirm("Are you sure you want to delete this match result?")) {
      try {
        await del(`/match-results/${resultId}`);
        await fetchMatchResults();
        toast.success("Match result deleted successfully");
      } catch (error) {
        console.error("Error deleting match result:", error);
        toast.error("Failed to delete match result");
      }
    }
  };

  const filteredResults = (matchResults || []).filter((result) => {
    const matchesSearch =
      result.fixture.home_team.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      result.fixture.away_team.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      result.fixture.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || result.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "In Progress":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string, timeString?: string) => {
    try {
      let dateToFormat: string;

      if (timeString) {
        // If we have both date and time, construct the full datetime
        if (dateString.includes("T")) {
          dateToFormat = dateString;
        } else {
          // Construct the date properly
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            const formattedDate = date.toISOString().split("T")[0];
            dateToFormat = `${formattedDate}T${timeString}`;
          } else {
            dateToFormat = `${dateString}T${timeString}`;
          }
        }
      } else {
        dateToFormat = dateString;
      }

      const date = new Date(dateToFormat);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Date not available";
      }

      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not available";
    }
  };

  const calculateFieldGoalPercentage = (made: number, attempted: number) => {
    if (attempted === 0) return "0%";
    return `${((made / attempted) * 100).toFixed(1)}%`;
  };

  const calculateThreePointPercentage = (made: number, attempted: number) => {
    if (attempted === 0) return "0%";
    return `${((made / attempted) * 100).toFixed(1)}%`;
  };

  const calculateFreeThrowPercentage = (made: number, attempted: number) => {
    if (attempted === 0) return "0%";
    return `${((made / attempted) * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading match results...
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
                Match Results
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                View and manage match results and statistics
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search match results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={16} />}
                  />
                </div>
                {/* <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select> */}
              </div>
            </CardBody>
          </Card>

          {/* Match Results Table */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6">
              <h2 className="text-xl font-bold">
                Match Results ({filteredResults.length})
              </h2>
              <p className="text-neutral-300 text-sm mt-1">
                Basketball Development League Match Results
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Match
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    {/* <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th> */}
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Winner
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredResults.map((result, index) => (
                    <motion.tr
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          {/* Home Team */}
                          <div className="flex items-center space-x-3">
                            {result.fixture.home_team.logo_url ? (
                              <img
                                src={result.fixture.home_team.logo_url}
                                alt={result.fixture.home_team.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700 ${
                                result.fixture.home_team.logo_url
                                  ? "hidden"
                                  : ""
                              }`}
                            >
                              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                                {result.fixture.home_team.name[0]}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {result.fixture.home_team.name}
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
                                {result.fixture.away_team.name}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                Away
                              </div>
                            </div>
                            {result.fixture.away_team.logo_url ? (
                              <img
                                src={result.fixture.away_team.logo_url}
                                alt={result.fixture.away_team.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.previousElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700 ${
                                result.fixture.away_team.logo_url
                                  ? "hidden"
                                  : ""
                              }`}
                            >
                              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                                {result.fixture.away_team.name[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {result.home_team_score} - {result.away_team_score}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {formatDate(
                            result.fixture.fixture_date,
                            result.fixture.fixture_time
                          )}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            result.status
                          )}`}
                        >
                          {result.status}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {result.winner ? (
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {result.winner === "home"
                              ? result.fixture.home_team.name
                              : result.fixture.away_team.name}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedResult(result);
                              setShowDetailsModal(true);
                            }}
                            leftIcon={<Eye size={14} />}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteResult(result.id)}
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

            {filteredResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No match results found matching your criteria.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Match Details
                </h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedResult(null);
                  }}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Match Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="flex flex-col items-center space-y-3">
                    {selectedResult.fixture.home_team.logo_url ? (
                      <img
                        src={selectedResult.fixture.home_team.logo_url}
                        alt={selectedResult.fixture.home_team.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-4 border-white dark:border-neutral-700 shadow-lg ${
                        selectedResult.fixture.home_team.logo_url
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                        {selectedResult.fixture.home_team.name[0]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {selectedResult.fixture.home_team.name}
                    </h3>
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {selectedResult.home_team_score}
                    </div>
                  </div>
                </div>
                <div className="text-center flex items-center justify-center">
                  <div className="text-2xl font-bold text-neutral-500 dark:text-neutral-400">
                    VS
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex flex-col items-center space-y-3">
                    {selectedResult.fixture.away_team.logo_url ? (
                      <img
                        src={selectedResult.fixture.away_team.logo_url}
                        alt={selectedResult.fixture.away_team.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.previousElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-4 border-white dark:border-neutral-700 shadow-lg ${
                        selectedResult.fixture.away_team.logo_url
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                        {selectedResult.fixture.away_team.name[0]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {selectedResult.fixture.away_team.name}
                    </h3>
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {selectedResult.away_team_score}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Home Team Stats */}
                <Card>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                      {selectedResult.fixture.home_team.name} Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Field Goals:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_field_goals_made}/
                            {selectedResult.home_field_goals_attempted} (
                            {calculateFieldGoalPercentage(
                              selectedResult.home_field_goals_made,
                              selectedResult.home_field_goals_attempted
                            )}
                            )
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            3-Pointers:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_three_pointers_made}/
                            {selectedResult.home_three_pointers_attempted} (
                            {calculateThreePointPercentage(
                              selectedResult.home_three_pointers_made,
                              selectedResult.home_three_pointers_attempted
                            )}
                            )
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Free Throws:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_free_throws_made}/
                            {selectedResult.home_free_throws_attempted} (
                            {calculateFreeThrowPercentage(
                              selectedResult.home_free_throws_made,
                              selectedResult.home_free_throws_attempted
                            )}
                            )
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Rebounds:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_rebounds_total}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Assists:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_assists}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Steals:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_steals}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Blocks:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_blocks}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Turnovers:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_turnovers}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Fouls:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.home_fouls}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Away Team Stats */}
                <Card>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                      {selectedResult.fixture.away_team.name} Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Field Goals:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_field_goals_made}/
                            {selectedResult.away_field_goals_attempted} (
                            {calculateFieldGoalPercentage(
                              selectedResult.away_field_goals_made,
                              selectedResult.away_field_goals_attempted
                            )}
                            )
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            3-Pointers:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_three_pointers_made}/
                            {selectedResult.away_three_pointers_attempted} (
                            {calculateThreePointPercentage(
                              selectedResult.away_three_pointers_made,
                              selectedResult.away_three_pointers_attempted
                            )}
                            )
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Free Throws:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_free_throws_made}/
                            {selectedResult.away_free_throws_attempted} (
                            {calculateFreeThrowPercentage(
                              selectedResult.away_free_throws_made,
                              selectedResult.away_free_throws_attempted
                            )}
                            )
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Rebounds:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_rebounds_total}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Assists:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_assists}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Steals:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_steals}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Blocks:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_blocks}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Turnovers:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_turnovers}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Fouls:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedResult.away_fouls}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Match Info */}
              {selectedResult.notes && (
                <Card className="mt-6">
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                      Match Notes
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {selectedResult.notes}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};
