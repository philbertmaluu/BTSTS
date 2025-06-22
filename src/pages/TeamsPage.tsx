import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Users, Trophy, Target } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { get } from "../api/baseApi";

interface Team {
  id: string;
  name: string;
  logo: string;
  // Add any additional fields that might come from the API
  abbreviation?: string;
  conference?: string;
  division?: string;
  wins?: number;
  losses?: number;
  winPercentage?: number;
}

export const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [searchQuery, teams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first
      const apiTeams = await get<Team[]>("/teams");

      // If API returns data, use it; otherwise fall back to local data
      if (apiTeams && apiTeams.length > 0) {
        setTeams(apiTeams);
      } else {
        // Fallback to local data with local images
        const fallbackTeams: Team[] = [
          {
            id: "1",
            name: "Army Basketball Club",
            logo: "/images/ABC.jpeg",
            abbreviation: "ABC",
            wins: 12,
            losses: 8,
            winPercentage: 0.6,
          },
          {
            id: "2",
            name: "Chui Basketball Club",
            logo: "/images/CHUI.jpeg",
            abbreviation: "CHUI",
            wins: 15,
            losses: 5,
            winPercentage: 0.75,
          },
          {
            id: "3",
            name: "JKT Basketball Club",
            logo: "/images/JKT.jpeg",
            abbreviation: "JKT",
            wins: 10,
            losses: 10,
            winPercentage: 0.5,
          },
          {
            id: "4",
            name: "Darcity Basketball Club",
            logo: "/images/DARCITY.jpeg",
            abbreviation: "DARCITY",
            wins: 8,
            losses: 12,
            winPercentage: 0.4,
          },
          {
            id: "5",
            name: "KIUT Giants Club",
            logo: "/images/KIUT.jpeg",
            abbreviation: "KIUT",
            wins: 18,
            losses: 2,
            winPercentage: 0.9,
          },
          {
            id: "6",
            name: "Pazi Basketball Club",
            logo: "/images/PAZI.jpeg",
            abbreviation: "PAZI",
            wins: 6,
            losses: 14,
            winPercentage: 0.3,
          },
          {
            id: "7",
            name: "UDSM Outsiders",
            logo: "/images/UDSM.jpeg",
            abbreviation: "UDSM",
            wins: 14,
            losses: 6,
            winPercentage: 0.7,
          },
        ];
        setTeams(fallbackTeams);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError("Failed to load teams. Please try again later.");

      // Fallback to local data on error
      const fallbackTeams: Team[] = [
        {
          id: "1",
          name: "Army Basketball Club",
          logo: "/images/ABC.jpeg",
          abbreviation: "ABC",
          wins: 12,
          losses: 8,
          winPercentage: 0.6,
        },
        {
          id: "2",
          name: "Chui Basketball Club",
          logo: "/images/CHUI.jpeg",
          abbreviation: "CHUI",
          wins: 15,
          losses: 5,
          winPercentage: 0.75,
        },
        {
          id: "3",
          name: "JKT Basketball Club",
          logo: "/images/JKT.jpeg",
          abbreviation: "JKT",
          wins: 10,
          losses: 10,
          winPercentage: 0.5,
        },
        {
          id: "4",
          name: "Darcity Basketball Club",
          logo: "/images/DARCITY.jpeg",
          abbreviation: "DARCITY",
          wins: 8,
          losses: 12,
          winPercentage: 0.4,
        },
        {
          id: "5",
          name: "KIUT Giants Club",
          logo: "/images/KIUT.jpeg",
          abbreviation: "KIUT",
          wins: 18,
          losses: 2,
          winPercentage: 0.9,
        },
        {
          id: "6",
          name: "Pazi Basketball Club",
          logo: "/images/PAZI.jpeg",
          abbreviation: "PAZI",
          wins: 6,
          losses: 14,
          winPercentage: 0.3,
        },
        {
          id: "7",
          name: "UDSM Outsiders",
          logo: "/images/UDSM.jpeg",
          abbreviation: "UDSM",
          wins: 14,
          losses: 6,
          winPercentage: 0.7,
        },
      ];
      setTeams(fallbackTeams);
    } finally {
      setLoading(false);
    }
  };

  const getWinPercentageColor = (percentage: number) => {
    if (percentage >= 0.7) return "text-green-500";
    if (percentage >= 0.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getTeamCardGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-red-500 to-orange-600",
      "from-green-500 to-teal-600",
      "from-yellow-500 to-orange-500",
      "from-purple-500 to-pink-600",
      "from-indigo-500 to-blue-600",
      "from-emerald-500 to-green-600",
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
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
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                Basketball Dar es Salaam League
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                Discover all the teams competing in the league
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search teams..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-center"
              >
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Total Teams
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {teams.length}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Trophy
                      className="text-green-600 dark:text-green-400"
                      size={24}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Top Team
                    </p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">
                      {teams.find(
                        (t) =>
                          t.winPercentage ===
                          Math.max(
                            ...teams.map((team) => team.winPercentage || 0)
                          )
                      )?.name || "N/A"}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Target
                      className="text-purple-600 dark:text-purple-400"
                      size={24}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Active Season
                    </p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">
                      2024-25
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getTeamCardGradient(
                        index
                      )} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    {/* Card Content */}
                    <div className="relative p-6">
                      {/* Team Logo */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-20 h-20 object-cover rounded-full border-4 border-white dark:border-neutral-700 shadow-lg group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {team.abbreviation?.slice(0, 2) ||
                                team.name.slice(0, 2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Team Name */}
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white text-center mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {team.name}
                      </h3>

                      {/* Team Stats */}
                      {team.wins !== undefined && team.losses !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Record:
                            </span>
                            <span className="font-semibold text-neutral-900 dark:text-white">
                              {team.wins}-{team.losses}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Win %:
                            </span>
                            <span
                              className={`font-semibold ${getWinPercentageColor(
                                team.winPercentage || 0
                              )}`}
                            >
                              {((team.winPercentage || 0) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {filteredTeams.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Users className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                  No teams found
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Try adjusting your search terms
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};
