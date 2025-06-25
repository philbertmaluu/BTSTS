import React, { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { get } from "../api/baseApi";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { Trophy, BarChart3 } from "lucide-react";

// TypeScript interfaces for the API response
interface Team {
  id: number;
  name: string;
  logo: string | null;
  coach_id: number;
  created_at: string;
  updated_at: string;
}

interface Fixture {
  id: number;
  home_team_id: number;
  away_team_id: number;
  fixture_date: string;
  fixture_time: string;
  venue: string;
  status: string;
  created_at: string;
  updated_at: string;
  home_team: Team;
  away_team: Team;
}

interface MatchResult {
  id: number;
  fixture_id: number;
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
  status: string;
  game_start_time?: string;
  game_end_time?: string;
  winner?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  fixture: Fixture;
}

interface ApiResponse {
  success: boolean;
  data: MatchResult[];
}

// Team logo mapping
const teamLogos: { [key: string]: string } = {
  "Army Basketball Club": "/images/ABC.jpeg",
  "Chui Basketball Club": "/images/CHUI.jpeg",
  "JKT Basketball Club": "/images/JKT.jpeg",
  "Jkt Basketball Club": "/images/JKT.jpeg",
  "Darcity Basketball Club": "/images/DARCITY.jpeg",
  "Dar City Basketball Club": "/images/DARCITY.jpeg",
  "KIUT Giants Club": "/images/KIUT.jpeg",
  "Pazi Basketball Club": "/images/PAZI.jpeg",
  "UDSM Outsiders": "/images/UDSM.jpeg",
};

export default function MatchResults() {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<MatchResult | null>(
    null
  );

  // Fetch match results from the API
  const fetchMatchResults = async () => {
    try {
      setLoading(true);
      console.log("Starting API request to match-results endpoint...");

      const response = await get<ApiResponse>("match-results");
      console.log("API Response:", response);

      if (response.success) {
        console.log("Setting match results:", response.data);
        setMatchResults(response.data);
      } else {
        setError("Failed to load match results");
      }
    } catch (err) {
      console.error("Error fetching match results:", err);

      if (err instanceof AxiosError) {
        console.error("Axios Error Details:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            headers: err.config?.headers,
          },
        });

        if (err.code === "ERR_NETWORK") {
          setError("Network error - please check your connection");
        } else if (err.response?.status === 0) {
          setError("CORS error - server not allowing cross-origin requests");
        } else {
          setError(
            err.response?.data?.message || err.message || "An error occurred"
          );
        }
      } else {
        console.error("Non-Axios error:", err);
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMatchResults();
  }, []);

  // Format date and time for display
  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${formattedDate} at ${time}`;
  };

  // Get team logo
  const getTeamLogo = (teamName: string) => {
    return teamLogos[teamName] || "/images/default-team.png";
  };

  // Calculate field goal percentage
  const calculateFieldGoalPercentage = (made: number, attempted: number) => {
    if (attempted === 0) return 0;
    return ((made / attempted) * 100).toFixed(1);
  };

  // Calculate three pointer percentage
  const calculateThreePointerPercentage = (made: number, attempted: number) => {
    if (attempted === 0) return 0;
    return ((made / attempted) * 100).toFixed(1);
  };

  // Calculate free throw percentage
  const calculateFreeThrowPercentage = (made: number, attempted: number) => {
    if (attempted === 0) return 0;
    return ((made / attempted) * 100).toFixed(1);
  };

  // Get winner
  const getWinner = (result: MatchResult) => {
    if (result.home_team_score > result.away_team_score) {
      return result.fixture.home_team.name;
    } else if (result.away_team_score > result.home_team_score) {
      return result.fixture.away_team.name;
    }
    return "Tie";
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              Match Results
            </h1>
            <div className="flex justify-center items-center h-64">
              <div className="text-neutral-600 dark:text-neutral-400">
                Loading match results...
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              Match Results
            </h1>
            <div className="flex justify-center items-center h-64">
              <div className="text-red-600 dark:text-red-400">
                Error: {error}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Match Results
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              View detailed statistics and results from completed basketball
              matches
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {matchResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-neutral-200 dark:border-neutral-700"
              >
                {/* Winner Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center space-x-1 ${
                      getWinner(result) === result.fixture.home_team.name
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : getWinner(result) === result.fixture.away_team.name
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    <Trophy size={12} />
                    <span>
                      {getWinner(result) === "Tie" ? "TIE" : "WINNER"}
                    </span>
                  </span>
                </div>

                {/* Card Header with Date */}
                <div className="p-6 pb-4">
                  <div className="text-center mb-4">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                      {formatDateTime(
                        result.fixture.fixture_date,
                        result.fixture.fixture_time
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      📍 {result.fixture.venue}
                    </div>
                  </div>

                  {/* Teams Section with Scores */}
                  <div className="space-y-6">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="relative">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                              getWinner(result) ===
                              result.fixture.home_team.name
                                ? "bg-gradient-to-br from-orange-400 to-red-500 ring-2 ring-orange-300"
                                : "bg-gradient-to-br from-orange-400 to-red-500"
                            }`}
                          >
                            <img
                              src={getTeamLogo(result.fixture.home_team.name)}
                              alt={result.fixture.home_team.name}
                              className="w-12 h-12 object-contain rounded-full"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-neutral-700 rounded-full border-2 border-white dark:border-neutral-700 flex items-center justify-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                            {result.fixture.home_team.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Home Team
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                          {result.home_team_score}
                        </div>
                      </div>
                    </div>

                    {/* VS Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200 dark:border-neutral-600"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-neutral-800 px-4 py-2 text-lg font-bold text-neutral-400 dark:text-neutral-500">
                          VS
                        </span>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="relative">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                              getWinner(result) ===
                              result.fixture.away_team.name
                                ? "bg-gradient-to-br from-blue-400 to-purple-500 ring-2 ring-blue-300"
                                : "bg-gradient-to-br from-blue-400 to-purple-500"
                            }`}
                          >
                            <img
                              src={getTeamLogo(result.fixture.away_team.name)}
                              alt={result.fixture.away_team.name}
                              className="w-12 h-12 object-contain rounded-full"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-neutral-700 rounded-full border-2 border-white dark:border-neutral-700 flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                            {result.fixture.away_team.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Away Team
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                          {result.away_team_score}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Total Points
                      </div>
                      <div className="text-xl font-bold text-neutral-900 dark:text-white">
                        {result.home_team_score + result.away_team_score}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Point Difference
                      </div>
                      <div className="text-xl font-bold text-neutral-900 dark:text-white">
                        {Math.abs(
                          result.home_team_score - result.away_team_score
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 border-t border-neutral-200 dark:border-neutral-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Result #{result.id}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedResult(
                          selectedResult?.id === result.id ? null : result
                        )
                      }
                      className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                      {selectedResult?.id === result.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                </div>

                {/* Detailed Stats Modal */}
                {selectedResult?.id === result.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700"
                  >
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
                        <BarChart3 size={20} className="mr-2" />
                        Detailed Statistics
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Home Team Stats */}
                        <div>
                          <h5 className="font-semibold text-neutral-900 dark:text-white mb-3 text-center">
                            {result.fixture.home_team.name}
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Field Goals:
                              </span>
                              <span className="font-medium">
                                {result.home_field_goals_made}/
                                {result.home_field_goals_attempted} (
                                {calculateFieldGoalPercentage(
                                  result.home_field_goals_made,
                                  result.home_field_goals_attempted
                                )}
                                %)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                3-Pointers:
                              </span>
                              <span className="font-medium">
                                {result.home_three_pointers_made}/
                                {result.home_three_pointers_attempted} (
                                {calculateThreePointerPercentage(
                                  result.home_three_pointers_made,
                                  result.home_three_pointers_attempted
                                )}
                                %)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Free Throws:
                              </span>
                              <span className="font-medium">
                                {result.home_free_throws_made}/
                                {result.home_free_throws_attempted} (
                                {calculateFreeThrowPercentage(
                                  result.home_free_throws_made,
                                  result.home_free_throws_attempted
                                )}
                                %)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Assists:
                              </span>
                              <span className="font-medium">
                                {result.home_assists}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Rebounds:
                              </span>
                              <span className="font-medium">
                                {result.home_rebounds_total} (O:{" "}
                                {result.home_rebounds_offensive}, D:{" "}
                                {result.home_rebounds_defensive})
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Blocks:
                              </span>
                              <span className="font-medium">
                                {result.home_blocks}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Steals:
                              </span>
                              <span className="font-medium">
                                {result.home_steals}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Turnovers:
                              </span>
                              <span className="font-medium">
                                {result.home_turnovers}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Fouls:
                              </span>
                              <span className="font-medium">
                                {result.home_fouls}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Away Team Stats */}
                        <div>
                          <h5 className="font-semibold text-neutral-900 dark:text-white mb-3 text-center">
                            {result.fixture.away_team.name}
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Field Goals:
                              </span>
                              <span className="font-medium">
                                {result.away_field_goals_made}/
                                {result.away_field_goals_attempted} (
                                {calculateFieldGoalPercentage(
                                  result.away_field_goals_made,
                                  result.away_field_goals_attempted
                                )}
                                %)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                3-Pointers:
                              </span>
                              <span className="font-medium">
                                {result.away_three_pointers_made}/
                                {result.away_three_pointers_attempted} (
                                {calculateThreePointerPercentage(
                                  result.away_three_pointers_made,
                                  result.away_three_pointers_attempted
                                )}
                                %)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Free Throws:
                              </span>
                              <span className="font-medium">
                                {result.away_free_throws_made}/
                                {result.away_free_throws_attempted} (
                                {calculateFreeThrowPercentage(
                                  result.away_free_throws_made,
                                  result.away_free_throws_attempted
                                )}
                                %)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Assists:
                              </span>
                              <span className="font-medium">
                                {result.away_assists}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Rebounds:
                              </span>
                              <span className="font-medium">
                                {result.away_rebounds_total} (O:{" "}
                                {result.away_rebounds_offensive}, D:{" "}
                                {result.away_rebounds_defensive})
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Blocks:
                              </span>
                              <span className="font-medium">
                                {result.away_blocks}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Steals:
                              </span>
                              <span className="font-medium">
                                {result.away_steals}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Turnovers:
                              </span>
                              <span className="font-medium">
                                {result.away_turnovers}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Fouls:
                              </span>
                              <span className="font-medium">
                                {result.away_fouls}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {result.notes && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h6 className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                            Notes:
                          </h6>
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            {result.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:to-primary-600/5 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {matchResults.length === 0 && !loading && !error && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <Trophy size={48} className="text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                No match results available
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Match results will appear here once games are completed
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
