import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Save, Play, Square } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { post } from "../../api/baseApi";
import { getAuthToken } from "../../api/auth";
import { message } from "antd";

interface MatchStats {
  // Final Scores
  home_team_score: number;
  away_team_score: number;

  // Home Team Statistics
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

  // Away Team Statistics
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

  // Game Information
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  game_start_time?: string;
  game_end_time?: string;
  winner?: "home" | "away";
  notes?: string;
}

interface ScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    id: string;
    homeTeam: {
      name: string;
      score: number;
      logo: string;
    };
    awayTeam: {
      name: string;
      score: number;
      logo: string;
    };
    status: string;
    startTime: string;
    venue: string;
  };
  onScoreUpdate: (team: "home" | "away", points: number) => void;
  onSaveMatch: (matchStats: MatchStats) => void;
}

const initialStats: MatchStats = {
  home_team_score: 0,
  away_team_score: 0,
  home_field_goals_made: 0,
  home_field_goals_attempted: 0,
  home_three_pointers_made: 0,
  home_three_pointers_attempted: 0,
  home_free_throws_made: 0,
  home_free_throws_attempted: 0,
  home_assists: 0,
  home_rebounds_offensive: 0,
  home_rebounds_defensive: 0,
  home_rebounds_total: 0,
  home_blocks: 0,
  home_steals: 0,
  home_turnovers: 0,
  home_fouls: 0,
  away_field_goals_made: 0,
  away_field_goals_attempted: 0,
  away_three_pointers_made: 0,
  away_three_pointers_attempted: 0,
  away_free_throws_made: 0,
  away_free_throws_attempted: 0,
  away_assists: 0,
  away_rebounds_offensive: 0,
  away_rebounds_defensive: 0,
  away_rebounds_total: 0,
  away_blocks: 0,
  away_steals: 0,
  away_turnovers: 0,
  away_fouls: 0,
  status: "Scheduled",
};

export const ScoringModal: React.FC<ScoringModalProps> = ({
  isOpen,
  onClose,
  match,
  onScoreUpdate,
  onSaveMatch,
}) => {
  const [stats, setStats] = useState<MatchStats>(initialStats);
  const [gameStatus, setGameStatus] = useState<
    "Scheduled" | "In Progress" | "Completed"
  >("Scheduled");
  const [notes, setNotes] = useState("");

  const updateStat = (
    team: "home" | "away",
    stat: keyof MatchStats,
    value: number
  ) => {
    setStats((prev) => ({
      ...prev,
      [stat]: Math.max(0, (prev[stat] as number) + value),
    }));
  };

  const startGame = () => {
    setGameStatus("In Progress");
    setStats((prev) => ({
      ...prev,
      status: "In Progress",
      game_start_time: new Date().toISOString(),
    }));
  };

  const endGame = () => {
    setGameStatus("Completed");
    const winner =
      stats.home_team_score > stats.away_team_score ? "home" : "away";
    setStats((prev) => ({
      ...prev,
      status: "Completed",
      game_end_time: new Date().toISOString(),
      winner,
    }));
  };

  const saveMatch = async () => {
    const matchStats: MatchStats = {
      ...stats,
      notes,
      home_team_score: match.homeTeam.score,
      away_team_score: match.awayTeam.score,
    };
    
    try {
      // const token = getAuthToken();
      const token = localStorage.getItem('btsts-token');
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await post("/match-results", {
        token,
        match_id: match.id,
        ...matchStats
      });

      if (response.success) {
        onSaveMatch(matchStats);
        onClose();
      } else {
        throw new Error(response.message || "Failed to save match results");
      }
    } catch (err) {
      console.error("Error saving match results:", err);
      // Here you might want to show an error message to the user
    }
  };

  const StatRow = ({
    label,
    homeValue,
    awayValue,
    onHomeChange,
    onAwayChange,
    showPercentage = false,
  }: {
    label: string;
    homeValue: number;
    awayValue: number;
    onHomeChange: (value: number) => void;
    onAwayChange: (value: number) => void;
    showPercentage?: boolean;
  }) => (
    <div className="grid grid-cols-4 gap-2 items-center py-2 border-b border-neutral-200 dark:border-neutral-700">
      <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </div>
      <div className="flex items-center space-x-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onHomeChange(-1)}
          className="w-8 h-8 p-0"
        >
          <Minus size={12} />
        </Button>
        <span className="w-12 text-center text-sm font-semibold">
          {homeValue}
          {showPercentage && homeValue > 0 && (
            <span className="text-xs text-neutral-500">
              ({((homeValue / (homeValue + awayValue)) * 100).toFixed(1)}%)
            </span>
          )}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onHomeChange(1)}
          className="w-8 h-8 p-0"
        >
          <Plus size={12} />
        </Button>
      </div>
      <div className="text-center text-sm text-neutral-500">VS</div>
      <div className="flex items-center space-x-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAwayChange(-1)}
          className="w-8 h-8 p-0"
        >
          <Minus size={12} />
        </Button>
        <span className="w-12 text-center text-sm font-semibold">
          {awayValue}
          {showPercentage && awayValue > 0 && (
            <span className="text-xs text-neutral-500">
              ({((awayValue / (homeValue + awayValue)) * 100).toFixed(1)}%)
            </span>
          )}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAwayChange(1)}
          className="w-8 h-8 p-0"
        >
          <Plus size={12} />
        </Button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Match Scoring
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    {match.venue} • {new Date(match.startTime).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        gameStatus === "Scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : gameStatus === "In Progress"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {gameStatus}
                    </span>
                    {gameStatus === "Scheduled" && (
                      <Button
                        onClick={startGame}
                        leftIcon={<Play size={16} />}
                        size="sm"
                      >
                        Start Game
                      </Button>
                    )}
                    {gameStatus === "In Progress" && (
                      <Button
                        onClick={endGame}
                        leftIcon={<Square size={16} />}
                        size="sm"
                        variant="outline"
                      >
                        End Game
                      </Button>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full"
                  >
                    <X
                      size={20}
                      className="text-neutral-500 dark:text-neutral-400"
                    />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6 space-y-6">
                  {/* Score Display */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Current Score
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <div className="flex items-center justify-center space-x-8">
                        <div className="text-center">
                          <img
                            src={match.homeTeam.logo}
                            alt={match.homeTeam.name}
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                          />
                          <h4 className="font-semibold text-neutral-900 dark:text-white">
                            {match.homeTeam.name}
                          </h4>
                          <p className="text-4xl font-bold text-primary-500">
                            {match.homeTeam.score}
                          </p>
                        </div>
                        <div className="text-3xl font-bold text-neutral-400">
                          VS
                        </div>
                        <div className="text-center">
                          <img
                            src={match.awayTeam.logo}
                            alt={match.awayTeam.name}
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                          />
                          <h4 className="font-semibold text-neutral-900 dark:text-white">
                            {match.awayTeam.name}
                          </h4>
                          <p className="text-4xl font-bold text-primary-500">
                            {match.awayTeam.score}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Quick Score Buttons */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Quick Score
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-neutral-900 dark:text-white text-center">
                            {match.homeTeam.name}
                          </h4>
                          <div className="flex space-x-2">
                            {[1, 2, 3].map((points) => (
                              <Button
                                key={`home-${points}`}
                                onClick={() => onScoreUpdate("home", points)}
                                className="flex-1"
                                size="sm"
                              >
                                +{points}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-neutral-900 dark:text-white text-center">
                            {match.awayTeam.name}
                          </h4>
                          <div className="flex space-x-2">
                            {[1, 2, 3].map((points) => (
                              <Button
                                key={`away-${points}`}
                                onClick={() => onScoreUpdate("away", points)}
                                className="flex-1"
                                size="sm"
                              >
                                +{points}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Detailed Statistics */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Detailed Statistics
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        {/* Shooting */}
                        <div>
                          <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
                            Shooting
                          </h4>
                          <StatRow
                            label="Field Goals Made"
                            homeValue={stats.home_field_goals_made}
                            awayValue={stats.away_field_goals_made}
                            onHomeChange={(value) =>
                              updateStat("home", "home_field_goals_made", value)
                            }
                            onAwayChange={(value) =>
                              updateStat("away", "away_field_goals_made", value)
                            }
                          />
                          <StatRow
                            label="Field Goals Attempted"
                            homeValue={stats.home_field_goals_attempted}
                            awayValue={stats.away_field_goals_attempted}
                            onHomeChange={(value) =>
                              updateStat(
                                "home",
                                "home_field_goals_attempted",
                                value
                              )
                            }
                            onAwayChange={(value) =>
                              updateStat(
                                "away",
                                "away_field_goals_attempted",
                                value
                              )
                            }
                          />
                          <StatRow
                            label="3-Pointers Made"
                            homeValue={stats.home_three_pointers_made}
                            awayValue={stats.away_three_pointers_made}
                            onHomeChange={(value) =>
                              updateStat(
                                "home",
                                "home_three_pointers_made",
                                value
                              )
                            }
                            onAwayChange={(value) =>
                              updateStat(
                                "away",
                                "away_three_pointers_made",
                                value
                              )
                            }
                          />
                          <StatRow
                            label="3-Pointers Attempted"
                            homeValue={stats.home_three_pointers_attempted}
                            awayValue={stats.away_three_pointers_attempted}
                            onHomeChange={(value) =>
                              updateStat(
                                "home",
                                "home_three_pointers_attempted",
                                value
                              )
                            }
                            onAwayChange={(value) =>
                              updateStat(
                                "away",
                                "away_three_pointers_attempted",
                                value
                              )
                            }
                          />
                          <StatRow
                            label="Free Throws Made"
                            homeValue={stats.home_free_throws_made}
                            awayValue={stats.away_free_throws_made}
                            onHomeChange={(value) =>
                              updateStat("home", "home_free_throws_made", value)
                            }
                            onAwayChange={(value) =>
                              updateStat("away", "away_free_throws_made", value)
                            }
                          />
                          <StatRow
                            label="Free Throws Attempted"
                            homeValue={stats.home_free_throws_attempted}
                            awayValue={stats.away_free_throws_attempted}
                            onHomeChange={(value) =>
                              updateStat(
                                "home",
                                "home_free_throws_attempted",
                                value
                              )
                            }
                            onAwayChange={(value) =>
                              updateStat(
                                "away",
                                "away_free_throws_attempted",
                                value
                              )
                            }
                          />
                        </div>

                        {/* Other Stats */}
                        <div>
                          <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
                            Other Statistics
                          </h4>
                          <StatRow
                            label="Assists"
                            homeValue={stats.home_assists}
                            awayValue={stats.away_assists}
                            onHomeChange={(value) =>
                              updateStat("home", "home_assists", value)
                            }
                            onAwayChange={(value) =>
                              updateStat("away", "away_assists", value)
                            }
                          />
                          <StatRow
                            label="Offensive Rebounds"
                            homeValue={stats.home_rebounds_offensive}
                            awayValue={stats.away_rebounds_offensive}
                            onHomeChange={(value) =>
                              updateStat(
                                "home",
                                "home_rebounds_offensive",
                                value
                              )
                            }
                            onAwayChange={(value) =>
                              updateStat(
                                "away",
                                "away_rebounds_offensive",
                                value
                              )
                            }
                          />
                          <StatRow
                            label="Defensive Rebounds"
                            homeValue={stats.home_rebounds_defensive}
                            awayValue={stats.away_rebounds_defensive}
                            onHomeChange={(value) =>
                              updateStat(
                                "home",
                                "home_rebounds_defensive",
                                value
                              )
                            }
                            onAwayChange={(value) =>
                              updateStat(
                                "away",
                                "away_rebounds_defensive",
                                value
                              )
                            }
                          />
                          <StatRow
                            label="Total Rebounds"
                            homeValue={stats.home_rebounds_total}
                            awayValue={stats.away_rebounds_total}
                            onHomeChange={(value) =>
                              updateStat("home", "home_rebounds_total", value)
                            }
                            onAwayChange={(value) =>
                              updateStat("away", "away_rebounds_total", value)
                            }
                          />
                          <StatRow
                            label="Blocks"
                            homeValue={stats.home_blocks}
                            awayValue={stats.away_blocks}
                            onHomeChange={(value) =>
                              updateStat("home", "home_blocks", value)
                            }
                            onAwayChange={(value) =>
                              updateStat("away", "away_blocks", value)
                            }
                          />
                          <StatRow
                            label="Steals"
                            homeValue={stats.home_steals}
                            awayValue={stats.away_steals}
                            onHomeChange={(value) =>
                              updateStat("home", "home_steals", value)
                            }
                            onAwayChange={(value) =>
                              updateStat("away", "away_steals", value)
                            }
                          />
                          <StatRow
                            label="Turnovers"
                            homeValue={stats.home_turnovers}
                            awayValue={stats.away_turnovers}
                            onHomeChange={(value) =>
                              updateStat("home", "home_turnovers", value)
                            }
                            onAwayChange={(value) =>
                              updateStat("away", "away_turnovers", value)
                            }
                          />
                          <StatRow
                            label="Fouls"
                            homeValue={stats.home_fouls}
                            awayValue={stats.away_fouls}
                            onHomeChange={(value) =>
                              updateStat("home", "home_fouls", value)
                            }
                            onAwayChange={(value) =>
                              updateStat("away", "away_fouls", value)
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Notes */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Match Notes
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any notes about the match..."
                        className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white resize-none"
                        rows={3}
                      />
                    </CardBody>
                  </Card>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {gameStatus === "In Progress" && "Game in progress..."}
                  {gameStatus === "Completed" && "Game completed"}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={saveMatch} leftIcon={<Save size={16} />}>
                    Save Match
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
