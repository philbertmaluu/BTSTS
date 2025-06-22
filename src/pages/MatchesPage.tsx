import React, { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { get } from "../api/baseApi";
import { AxiosError } from "axios";

// TypeScript interfaces for the API response
interface Team {
  id: number;
  name: string;
  logo: string | null;
  coach_id: number;
  created_at: string;
  updated_at: string;
}

interface Match {
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

interface ApiResponse {
  success: boolean;
  data: Match[];
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

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch matches from the API using baseApi get method
  const fetchMatches = async () => {
    try {
      setLoading(true);
      console.log("Starting API request to fixtures endpoint...");

      const response = await get<ApiResponse>("fixtures");
      console.log("API Response:", response);

      if (response.success) {
        console.log("Setting matches:", response.data);
        setMatches(response.data);
      } else {
        setError("Failed to load matches");
      }
    } catch (err) {
      console.error("Error fetching matches:", err);

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
    fetchMatches();
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
              Match Fixtures
            </h1>
            <div className="flex justify-center items-center h-64">
              <div className="text-neutral-600 dark:text-neutral-400">
                Loading matches...
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
              Match Fixtures
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
              Match Fixtures
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Stay updated with all the latest basketball match schedules and
              results
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {matches.map((match) => (
              <div
                key={match.id}
                className="group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-neutral-200 dark:border-neutral-700"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      match.status === "Played"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : match.status === "Live"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {match.status}
                  </span>
                </div>

                {/* Card Header with Venue */}
                <div className="p-6 pb-4">
                  <div className="text-center mb-4">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                      {formatDateTime(match.fixture_date, match.fixture_time)}
                    </div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      📍 {match.venue}
                    </div>
                  </div>

                  {/* Teams Section */}
                  <div className="space-y-6">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <img
                              src={getTeamLogo(match.home_team.name)}
                              alt={match.home_team.name}
                              className="w-12 h-12 object-contain rounded-full"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-neutral-700 rounded-full border-2 border-white dark:border-neutral-700 flex items-center justify-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                            {match.home_team.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Home Team
                          </p>
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
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <img
                              src={getTeamLogo(match.away_team.name)}
                              alt={match.away_team.name}
                              className="w-12 h-12 object-contain rounded-full"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-neutral-700 rounded-full border-2 border-white dark:border-neutral-700 flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                            {match.away_team.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Away Team
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 border-t border-neutral-200 dark:border-neutral-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Match #{match.id}
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:to-primary-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {matches.length === 0 && !loading && !error && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <span className="text-4xl">🏀</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                No matches scheduled
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Check back later for upcoming fixtures
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};
