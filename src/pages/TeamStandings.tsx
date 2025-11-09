import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Loader2, AlertCircle, Calendar } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card } from "../components/ui/Card";
import { get } from "../api/baseApi";

// New interface for the API response
interface TeamStanding {
  team_id: number;
  team_name: string;
  team_logo: string;
  position: number;
  played: number;
  won: number;
  lost: number;
  won_by_walkover: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  win_percentage: number;
  form: string[];
}

interface TeamStandingsResponse {
  success: boolean;
  message: string;
  data: TeamStanding[];
}

// Team logo mapping for local images (fallback)
const teamLogos: { [key: string]: string } = {
  "Army Basketball Club": "/images/ABC.jpeg",
  "Chui Basketball Club": "/images/CHUI.jpeg",
  "Jkt Basketball Club": "/images/JKT.jpeg",
  "Dar City Basketball Club": "/images/DARCITY.jpeg",
  "Pazi Basketball Club": "/images/PAZI.jpeg",
  "UDSM Outsiders": "/images/UDSM.jpeg",
  "KIUT Giants Club": "/images/KIUT.jpeg",
  Chui: "/images/CHUI.jpeg",
  "UDSM OUTISIDES": "/images/UDSM.jpeg",
  "Army Basketball": "/images/ABC.jpeg",
};

// Add near the top with other interfaces
interface Season {
  id: number;
  name: string;
  year: number;
  is_active: boolean;
}

const TeamStandingsPage: React.FC = () => {
  // State declarations
  const [teamStats, setTeamStats] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);

  // Move fetchTeamStandings inside component
  const fetchTeamStandings = async (seasonId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response: TeamStandingsResponse = await get(
        `/team-standings${seasonId ? `?season_id=${seasonId}` : ''}`
      );

      if (response.success) {
        setTeamStats(response.data);
      } else {
        setError("Failed to fetch team standings");
      }
    } catch (err) {
      console.error("Error fetching team standings:", err);
      setError("Failed to load team standings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamStandings(selectedSeason || undefined);
  }, [selectedSeason]);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await get("/seasons");
      if (response.success) {
        setSeasons(response.data);
        // Find and set the active season
        const active = response.data.find((s: Season) => s.is_active);
        if (active) {
          setActiveSeason(active);
          setSelectedSeason(active.id);
        } else if (response.data.length > 0) {
          // Fallback to first season if no active season
          setSelectedSeason(response.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching seasons:", err);
    }
  };

  const getRankIcon = (rank: number) => {
      if (rank === 1) return "🥇";
      if (rank === 2) return "🥈";
      if (rank === 3) return "🥉";
      return rank;
    };

    const getFormDisplay = (form: string[]) => {
      return form.slice(-5).map((result, index) => (
        <span
          key={index}
          className={`inline-block w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mr-1 ${
            result === "W"
              ? "bg-green-500 text-white"
              : result === "L"
              ? "bg-red-500 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {result}
        </span>
      ));
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
                    onClick={fetchTeamStandings}
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
                  {selectedSeason 
                    ? seasons.find(s => s.id === selectedSeason)?.name || 'Basketball Dar es League'
                    : 'All Seasons'
                  }
                </p>
              </div>

              {/* Stats Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                              (sum, team) => sum + team.played,
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
                  <Card className="bg-gradient-to-r from-black to-black text-white">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white-100 text-sm font-medium">
                            Season Progress
                          </p>
                          <p className="text-3xl font-bold">
                            {selectedSeason
                              ? Math.round(((teamStats[0]?.played || 0) / 14) * 100)
                              : '-'}%
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Current Season Card */}
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
                            Current Season
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {activeSeason ? activeSeason.name : 'No Active Season'}
                          </p>
                          {/* <p className="text-purple-100 text-xs mt-1">
                            {activeSeason ? activeSeason.year : ''}
                          </p> */}
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6" />
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
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold">Current Standings</h2>
                        <p className="text-neutral-300 text-sm mt-1">
                          Updated standings as of {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-neutral-300" />
                        <select
                          value={selectedSeason || ""}
                          onChange={(e) => setSelectedSeason(Number(e.target.value) || null)}
                          className="bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          {seasons.map((season) => (
                            <option key={season.id} value={season.id}>
                              {season.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            POS
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            PLD
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            W
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            L
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            WO
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            GF
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            GA
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            GD
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            PTS
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            Form
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {teamStats.map((team, index) => {
                          const logo =
                            team.team_logo ||
                            teamLogos[team.team_name] ||
                            "/images/ABC.jpeg";

                          return (
                            <motion.tr
                              key={team.team_id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`
                                hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors
                                ${
                                  team.position <= 3
                                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                                    : ""
                                }
                                ${
                                  team.position === 1
                                    ? "border-l-4 border-yellow-500"
                                    : ""
                                }
                              `}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-lg mr-2">
                                    {getRankIcon(team.position)}
                                  </span>
                                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    {team.position}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                                      src={logo}
                                      alt={team.team_name}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                      {team.team_name}
                                    </div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                      {team.played} games
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  {team.played}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                  {team.won}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                  {team.lost}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  {team.won_by_walkover}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  {team.goals_for}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  {team.goals_against}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span
                                  className={`text-sm font-semibold ${
                                    team.goal_difference > 0
                                      ? "text-green-600 dark:text-green-400"
                                      : team.goal_difference < 0
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-neutral-900 dark:text-white"
                                  }`}
                                >
                                  {team.goal_difference > 0 ? "+" : ""}
                                  {team.goal_difference}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                  {team.points}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex justify-center">
                                  {getFormDisplay(team.form)}
                                </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
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
                      <div className="flex items-center">
                        <div className="flex space-x-1 mr-2">
                          <span className="w-4 h-4 bg-green-500 rounded text-white text-xs flex items-center justify-center">
                            W
                          </span>
                          <span className="w-4 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center">
                            L
                          </span>
                        </div>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Form (Last 5)
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
