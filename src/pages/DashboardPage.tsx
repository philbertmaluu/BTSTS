import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Clipboard,
  Clock,
  Play,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { StatsCard } from "../components/stats/StatsCard";
import { Button } from "../components/ui/Button";
import { ScoringModal } from "../components/scoring/ScoringModal";
import { useAuth } from "../context/AuthContext";

// Match data with local teams
const currentMatches = [
  {
    id: "1",
    homeTeam: {
      name: "Army Basketball Club",
      score: 0,
      logo: "/images/ABC.jpeg",
    },
    awayTeam: {
      name: "Chui Basketball Club",
      score: 0,
      logo: "/images/CHUI.jpeg",
    },
    status: "scheduled",
    startTime: "2025-06-21T18:00:00",
    venue: "National Indoor Stadium",
  },
  {
    id: "2",
    homeTeam: {
      name: "JKT Basketball Club",
      score: 0,
      logo: "/images/JKT.jpeg",
    },
    awayTeam: {
      name: "Darcity Basketball Club",
      score: 0,
      logo: "/images/DARCITY.jpeg",
    },
    status: "scheduled",
    startTime: "2025-06-22T19:00:00",
    venue: "National Indoor Stadium",
  },
  {
    id: "3",
    homeTeam: {
      name: "KIUT Giants Club",
      score: 0,
      logo: "/images/KIUT.jpeg",
    },
    awayTeam: {
      name: "Pazi Basketball Club",
      score: 0,
      logo: "/images/PAZI.jpeg",
    },
    status: "scheduled",
    startTime: "2025-06-23T18:30:00",
    venue: "National Indoor Stadium",
  },
  {
    id: "4",
    homeTeam: {
      name: "UDSM Outsiders",
      score: 0,
      logo: "/images/UDSM.jpeg",
    },
    awayTeam: {
      name: "Army Basketball Club",
      score: 0,
      logo: "/images/ABC.jpeg",
    },
    status: "scheduled",
    startTime: "2025-06-24T19:30:00",
    venue: "National Indoor Stadium",
  },
  {
    id: "5",
    homeTeam: {
      name: "Chui Basketball Club",
      score: 0,
      logo: "/images/CHUI.jpeg",
    },
    awayTeam: {
      name: "JKT Basketball Club",
      score: 0,
      logo: "/images/JKT.jpeg",
    },
    status: "scheduled",
    startTime: "2025-06-25T18:00:00",
    venue: "National Indoor Stadium",
  },
  {
    id: "6",
    homeTeam: {
      name: "Darcity Basketball Club",
      score: 0,
      logo: "/images/DARCITY.jpeg",
    },
    awayTeam: {
      name: "KIUT Giants Club",
      score: 0,
      logo: "/images/KIUT.jpeg",
    },
    status: "scheduled",
    startTime: "2025-06-26T20:00:00",
    venue: "National Indoor Stadium",
  },
];

export const DashboardPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState(currentMatches);
  const [selectedMatch, setSelectedMatch] = useState<
    (typeof currentMatches)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const formatMatchDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleStartScoring = (match: (typeof currentMatches)[0]) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleScoreUpdate = (team: "home" | "away", points: number) => {
    if (!selectedMatch) return;

    setMatches(
      currentMatches.map((match) => {
        if (match.id === selectedMatch.id) {
          return {
            ...match,
            status: "live",
            [team === "home" ? "homeTeam" : "awayTeam"]: {
              ...match[team === "home" ? "homeTeam" : "awayTeam"],
              score: Math.max(
                0,
                match[team === "home" ? "homeTeam" : "awayTeam"].score + points
              ),
            },
          };
        }
        return match;
      })
    );

    // Update selected match
    setSelectedMatch((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: "live",
        [team === "home" ? "homeTeam" : "awayTeam"]: {
          ...prev[team === "home" ? "homeTeam" : "awayTeam"],
          score: Math.max(
            0,
            prev[team === "home" ? "homeTeam" : "awayTeam"].score + points
          ),
        },
      };
    });
  };

  const handleSaveMatch = (matchStats: {
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
  }) => {
    // Here you would typically save the match data to your backend
    console.log("Saving match data:", matchStats);

    // Update the match status in the local state
    if (selectedMatch) {
      setMatches(
        currentMatches.map((match) => {
          if (match.id === selectedMatch.id) {
            return {
              ...match,
              status: "completed",
            };
          }
          return match;
        })
      );
    }

    // Close the modal
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const StatisticianDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Current Matches
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <img
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {match.homeTeam.name}
                          </p>
                          <p className="text-2xl font-bold text-primary-500">
                            {match.homeTeam.score}
                          </p>
                        </div>
                      </div>
                      <div className="text-neutral-500 dark:text-neutral-400 text-lg font-semibold">
                        VS
                      </div>
                      <div className="flex items-center">
                        <div className="mr-3 text-right">
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {match.awayTeam.name}
                          </p>
                          <p className="text-2xl font-bold text-primary-500">
                            {match.awayTeam.score}
                          </p>
                        </div>
                        <img
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        {formatMatchDate(match.startTime)}
                      </p>
                      <Button
                        leftIcon={<Play size={16} />}
                        variant={
                          match.status === "live" ? "primary" : "outline"
                        }
                        onClick={() => handleStartScoring(match)}
                      >
                        {match.status === "live"
                          ? "Continue Scoring"
                          : "Start Scoring"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {match.venue}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Matches Scored"
          value="12"
          icon={<Clipboard size={24} />}
          changePercentage={8}
          index={0}
        />
        <StatsCard
          title="Average Points"
          value="98.5"
          icon={<TrendingUp size={24} />}
          changePercentage={5}
          index={1}
        />
        <StatsCard
          title="Teams Tracked"
          value="8"
          icon={<Users size={24} />}
          index={2}
        />
        <StatsCard
          title="Next Match"
          value="In 2 hours"
          icon={<Calendar size={24} />}
          index={3}
        />
      </div>

      {selectedMatch && (
        <ScoringModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          match={selectedMatch}
          onScoreUpdate={handleScoreUpdate}
          onSaveMatch={handleSaveMatch}
        />
      )}
    </div>
  );

  const DefaultDashboard = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Games"
          value="28"
          icon={<Clipboard size={24} />}
          changePercentage={12}
          index={0}
        />
        <StatsCard
          title="Average Points"
          value="82.5"
          icon={<TrendingUp size={24} />}
          changePercentage={-3}
          index={1}
        />
        <StatsCard
          title="Team Win Rate"
          value="65%"
          icon={<Award size={24} />}
          changePercentage={5}
          index={2}
        />
        <StatsCard
          title="Next Game"
          value="May 15"
          icon={<Calendar size={24} />}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Team Performance
              </h2>
              <div className="flex space-x-2">
                <button className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
                  Week
                </button>
                <button className="text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300">
                  Month
                </button>
                <button className="text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300">
                  Year
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="w-full h-64 flex items-center justify-center">
                <LineChart
                  size={48}
                  className="text-neutral-300 dark:text-neutral-700"
                />
                <p className="ml-4 text-neutral-500 dark:text-neutral-400">
                  Performance chart visualization would appear here.
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Recent Activities
              </h2>
            </CardHeader>
            <CardBody>
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {[1, 2, 3, 4].map((item) => (
                  <li key={item} className="py-3">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                          <Clock size={16} className="text-primary-500" />
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          New game stats added
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Lakers vs. Celtics - May 10, 2025
                        </p>
                      </div>
                      <span className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
                        2h ago
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {hasRole("Statistician") ? (
        <StatisticianDashboard />
      ) : (
        <DefaultDashboard />
      )}
    </motion.div>
  );
};
