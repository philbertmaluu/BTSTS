import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card } from "../components/ui/Card";
import { get } from "../api/baseApi";
import { TeamStats, TeamStatsResponse } from "../types";

// Team logo mapping for local images
const teamLogos: { [key: string]: string } = {
  "Army Basketball Club": "/images/ABC.jpeg",
  "Chui Basketball Club": "/images/CHUI.jpeg",
  "Jkt Basketball Club": "/images/JKT.jpeg",
  "Dar City Basketball Club": "/images/DARCITY.jpeg",
  "Pazi Basketball Club": "/images/PAZI.jpeg",
  "UDSM Outsiders": "/images/UDSM.jpeg",
  "KIUT Giants Club": "/images/KIUT.jpeg",
};

const TeamStandingsPage: React.FC = () => {
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamStats();
  }, []);

  const fetchTeamStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: TeamStatsResponse = await get("/team-stats");

      if (response.success) {
        // Sort by points (descending), then by wins (descending), then by losses (ascending)
        const sortedStats = response.data.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.wins !== a.wins) return b.wins - a.wins;
          return a.losses - b.losses;
        });

        setTeamStats(sortedStats);
      } else {
        setError("Failed to fetch team statistics");
      }
    } catch (err) {
      console.error("Error fetching team stats:", err);
      setError("Failed to load team standings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getWinPercentage = (wins: number, losses: number) => {
    const total = wins + losses;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getTrendIcon = (currentRank: number, previousRank: number) => {
    if (currentRank < previousRank)
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (currentRank > previousRank)
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Loading team standings...
                </p>
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
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Error Loading Standings
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={fetchTeamStats}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Try Again
                </button>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                  League Standings
                </h1>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                Basketball Development League 2025 Season
              </p>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">
                          Total Teams
                        </p>
                        <p className="text-3xl font-bold">{teamStats.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">
                          Games Played
                        </p>
                        <p className="text-3xl font-bold">
                          {teamStats.reduce(
                            (sum, team) => sum + team.games_played,
                            0
                          ) / 2}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">
                          Season Progress
                        </p>
                        <p className="text-3xl font-bold">
                          {Math.round(
                            ((teamStats[0]?.games_played || 0) / 14) * 100
                          )}
                          %
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Standings Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6">
                  <h2 className="text-xl font-bold">Current Standings</h2>
                  <p className="text-neutral-300 text-sm mt-1">
                    Updated standings as of {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Team
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          W
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          L
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          PCT
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          GB
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {teamStats.map((team, index) => {
                        const rank = index + 1;
                        const winPercentage = getWinPercentage(
                          team.wins,
                          team.losses
                        );
                        const gamesBack =
                          rank === 1
                            ? "-"
                            : (teamStats[0].wins -
                                team.wins +
                                (team.losses - teamStats[0].losses)) /
                              2;
                        const logo =
                          teamLogos[team.team.name] || "/images/ABC.jpeg";

                        return (
                          <motion.tr
                            key={team.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`
                              hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors
                              ${
                                rank <= 3
                                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                                  : ""
                              }
                              ${
                                rank === 1 ? "border-l-4 border-yellow-500" : ""
                              }
                            `}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">
                                  {getRankIcon(rank)}
                                </span>
                                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  {rank}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                                    src={logo}
                                    alt={team.team.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    {team.team.name}
                                  </div>
                                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {team.games_played} games
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                {team.wins}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                {team.losses}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {winPercentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {typeof gamesBack === "number"
                                  ? gamesBack.toFixed(1)
                                  : gamesBack}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                {team.points}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {getTrendIcon(rank, rank)}{" "}
                              {/* Placeholder - would need previous rank data */}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6"
            >
              <Card>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Legend
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Playoff Position
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Wins
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Losses
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TeamStandingsPage;
