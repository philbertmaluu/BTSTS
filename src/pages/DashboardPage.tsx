import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Calendar,
  Clipboard,
  Play,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { StatsCard } from "../components/stats/StatsCard";
import { Button } from "../components/ui/Button";
import { ScoringModal } from "../components/scoring/ScoringModal";
import { useAuth } from "../context/AuthContext";
import { post, get } from "../api/baseApi";
import { AccountInactive } from "./AccountInactive";

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
  venue: {
    id: number;
    name: string;
    location: string;
    capacity: number;
    created_at: string;
    updated_at: string;
  };
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  season_id: number;
  statistician_id?: number;
  created_at: string;
  updated_at: string;
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
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  game_start_time?: string;
  game_end_time?: string;
  winner?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Match {
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
  status: "scheduled" | "live" | "completed";
  startTime: string;
  venue: string;
  matchResult?: MatchResult;
}

export const DashboardPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedMatches, setExpandedMatches] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (hasRole("Statistician")) {
      fetchFixtures();
    }
  }, [user, navigate, hasRole]);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      const response = await get<Fixture[]>("/statistician-fixtures");

      // Handle the API response structure
      let fixtures: Fixture[] = [];
      if (Array.isArray(response)) {
        fixtures = response;
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        const responseData = response as { data: Fixture[] };
        fixtures = Array.isArray(responseData.data) ? responseData.data : [];
      } else {
        console.error("Unexpected API response format:", response);
        fixtures = [];
      }

      // Fetch match results for completed fixtures
      const matchResultsResponse = await get<MatchResult[]>("/match-results");
      let matchResults: MatchResult[] = [];

      if (Array.isArray(matchResultsResponse)) {
        matchResults = matchResultsResponse;
      } else if (
        matchResultsResponse &&
        typeof matchResultsResponse === "object" &&
        "data" in matchResultsResponse
      ) {
        const responseData = matchResultsResponse as { data: MatchResult[] };
        matchResults = Array.isArray(responseData.data)
          ? responseData.data
          : [];
      }

      // Create a map of fixture_id to match result for quick lookup
      const matchResultsMap = new Map<number, MatchResult>();
      matchResults.forEach((result) => {
        matchResultsMap.set(result.fixture_id, result);
      });

      // Transform fixtures to matches format
      const transformedMatches: Match[] = fixtures.map((fixture) => {
        // Handle date and time construction more robustly
        let startTime = "";
        try {
          // Extract date part from fixture_date (remove time if present)
          const datePart = fixture.fixture_date.split('T')[0];
          // Combine date with fixture_time
          startTime = `${datePart}T${fixture.fixture_time}`;
        } catch (error) {
          console.error(
            "Error constructing date for fixture:",
            fixture.id,
            error
          );
          // Fallback: try to construct from original format
          startTime = `${fixture.fixture_date.split('T')[0]}T${fixture.fixture_time}`;
        }

        // Get match result if exists
        const matchResult = matchResultsMap.get(fixture.id);

        return {
          id: fixture.id.toString(),
          homeTeam: {
            name: fixture.home_team.name,
            score: matchResult?.home_team_score || 0,
            logo: fixture.home_team.logo_url || "",
          },
          awayTeam: {
            name: fixture.away_team.name,
            score: matchResult?.away_team_score || 0,
            logo: fixture.away_team.logo_url || "",
          },
          status: fixture.status.toLowerCase() as
            | "scheduled"
            | "live"
            | "completed",
          startTime,
          venue: typeof fixture.venue === 'string' ? fixture.venue : fixture.venue?.name || '',
          matchResult,
        };
      });

      setMatches(transformedMatches);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is active - if not, show AccountInactive page
  if (!user) return null;

  // Check if user is not active (status is not "approved")
  const isUserActive = user.status === "approved";

  if (!isUserActive) {
    return <AccountInactive />;
  }

  const formatMatchDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Date not available";
      }

      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not available";
    }
  };

  const handleStartScoring = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const toggleMatchStats = (matchId: string) => {
    setExpandedMatches(prev => {
      const newSet = new Set(prev);
      if (newSet.has(matchId)) {
        newSet.delete(matchId);
      } else {
        newSet.add(matchId);
      }
      return newSet;
    });
  };

  const handleSaveMatch = async (matchStats: {
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
    try {
      console.log("Starting to save match data..."); // Debug log

      // Prepare the data for the API
      const matchData = {
        fixture_id: selectedMatch?.id,
        ...matchStats,
        // Add any additional fields that might be needed
        home_team_score: matchStats.home_team_score,
        away_team_score: matchStats.away_team_score,
      };

      console.log("Match data to be sent:", matchData); // Debug log

      // Make API call to save match data
      const response = await post("/match-results", matchData);
      console.log("Match saved successfully:", response);

      // Update the match status in the local state
      if (selectedMatch) {
        setMatches((prevMatches) =>
          prevMatches.map((match) => {
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

      // Refresh fixtures to get updated data
      await fetchFixtures();

      // Close the modal
      setIsModalOpen(false);
      setSelectedMatch(null);
    } catch (error) {
      console.error("Error saving match:", error);
      // You might want to show an error message to the user here
      // For now, we'll just log the error
    }
  };

  const StatisticianDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Match Results & Live Games
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Track live scores and view completed match statistics
            </p>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  Loading fixtures...
                </p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No fixtures found.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600"
                  >
                    {/* Match Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            match.status === "live"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : match.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {match.status === "live"
                            ? "LIVE"
                            : match.status === "completed"
                            ? "FINAL"
                            : "SCHEDULED"}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {formatMatchDate(match.startTime)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {match.venue}
                        </p>
                      </div>
                    </div>

                    {/* Teams and Scores */}
                    <div className="grid grid-cols-3 gap-4 items-center mb-6">
                      {/* Home Team */}
                      <div className="text-center">
                        <div className="flex flex-col items-center space-y-3">
                          {match.homeTeam.logo ? (
                            <img
                              src={match.homeTeam.logo}
                              alt={match.homeTeam.name}
                              className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
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
                            className={`w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-4 border-white dark:border-neutral-700 shadow-lg ${
                              match.homeTeam.logo ? "hidden" : ""
                            }`}
                          >
                            <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                              {match.homeTeam.name[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                              {match.homeTeam.name}
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              Home
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Score Display */}
                      <div className="text-center">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-600">
                          <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                            {match.homeTeam.score} - {match.awayTeam.score}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {match.status === "live"
                              ? "Live Score"
                              : match.status === "completed"
                              ? "Final Score"
                              : "Scheduled"}
                          </div>
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="text-center">
                        <div className="flex flex-col items-center space-y-3">
                          {match.awayTeam.logo ? (
                            <img
                              src={match.awayTeam.logo}
                              alt={match.awayTeam.name}
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
                              match.awayTeam.logo ? "hidden" : ""
                            }`}
                          >
                            <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                              {match.awayTeam.name[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                              {match.awayTeam.name}
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              Away
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                      {match.status === "scheduled" && (
                        <Button
                          leftIcon={<Play size={16} />}
                          onClick={() => handleStartScoring(match)}
                          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2"
                        >
                          Start Scoring
                        </Button>
                      )}
                      {match.status === "live" && (
                        <Button
                          leftIcon={<Play size={16} />}
                          onClick={() => handleStartScoring(match)}
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
                        >
                          Continue Scoring
                        </Button>
                      )}
                      {match.status === "completed" && (
                        <Button
                          variant="outline"
                          onClick={() => toggleMatchStats(match.id)}
                          leftIcon={expandedMatches.has(match.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          className="px-6 py-2"
                        >
                          {expandedMatches.has(match.id) ? "Hide Statistics" : "View Statistics"}
                        </Button>
                      )}
                    </div>

                    {/* Detailed Statistics for Completed Matches */}
                    {match.status === "completed" && match.matchResult && expandedMatches.has(match.id) && (
                      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-600">
                        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 text-center">
                          Game Statistics
                        </h4>

                        <div className="grid grid-cols-2 gap-6">
                          {/* Home Team Stats */}
                          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-600">
                            <h5 className="font-semibold text-neutral-900 dark:text-white mb-3 text-center">
                              {match.homeTeam.name}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Field Goals:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_field_goals_made}/
                                  {match.matchResult.home_field_goals_attempted}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  3-Pointers:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_three_pointers_made}/
                                  {
                                    match.matchResult
                                      .home_three_pointers_attempted
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Free Throws:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_free_throws_made}/
                                  {match.matchResult.home_free_throws_attempted}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Rebounds:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_rebounds_total}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Assists:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_assists}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Steals:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_steals}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Blocks:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_blocks}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Turnovers:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_turnovers}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Fouls:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.home_fouls}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Away Team Stats */}
                          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-600">
                            <h5 className="font-semibold text-neutral-900 dark:text-white mb-3 text-center">
                              {match.awayTeam.name}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Field Goals:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_field_goals_made}/
                                  {match.matchResult.away_field_goals_attempted}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  3-Pointers:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_three_pointers_made}/
                                  {
                                    match.matchResult
                                      .away_three_pointers_attempted
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Free Throws:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_free_throws_made}/
                                  {match.matchResult.away_free_throws_attempted}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Rebounds:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_rebounds_total}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Assists:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_assists}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Steals:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_steals}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Blocks:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_blocks}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Turnovers:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_turnovers}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                  Fouls:
                                </span>
                                <span className="font-medium">
                                  {match.matchResult.away_fouls}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Winner Display */}
                        {match.matchResult.winner && (
                          <div className="mt-4 text-center">
                            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                              <span className="text-yellow-800 dark:text-yellow-400 font-semibold">
                                🏆 Winner:{" "}
                                {match.matchResult.winner === "home"
                                  ? match.homeTeam.name
                                  : match.awayTeam.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Fixtures"
          value={matches.length.toString()}
          icon={<Clipboard size={24} />}
          index={0}
        />
        <StatsCard
          title="Completed Matches"
          value={matches
            .filter((m) => m.status === "completed")
            .length.toString()}
          icon={<TrendingUp size={24} />}
          index={1}
        />
        <StatsCard
          title="Scheduled Matches"
          value={matches
            .filter((m) => m.status === "scheduled")
            .length.toString()}
          icon={<Users size={24} />}
          index={2}
        />
        <StatsCard
          title="Live Matches"
          value={matches.filter((m) => m.status === "live").length.toString()}
          icon={<Calendar size={24} />}
          index={3}
        />
      </div>

      {selectedMatch && (
        <ScoringModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          match={selectedMatch}
          onSaveMatch={handleSaveMatch}
        />
      )}
    </div>
  );

  const DefaultDashboard = () => {
    const [dashboardStats, setDashboardStats] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
      fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        const response = await get("/dashboard/stats") as { success: boolean; data: any };
        if (response.success) {
          setDashboardStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    if (statsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Fixtures"
            value={dashboardStats?.statistics?.total_fixtures?.toString() || "0"}
            icon={<Clipboard size={24} />}
            index={0}
          />
          <StatsCard
            title="Completed Matches"
            value={dashboardStats?.statistics?.completed_matches?.toString() || "0"}
            icon={<TrendingUp size={24} />}
            index={1}
          />
          <StatsCard
            title="Scheduled Matches"
            value={dashboardStats?.statistics?.scheduled_matches?.toString() || "0"}
            icon={<Award size={24} />}
            index={2}
          />
          <StatsCard
            title="Next Match"
            value={
              dashboardStats?.next_match
                ? `${dashboardStats.next_match.home_team.name} vs ${dashboardStats.next_match.away_team.name}`
                : "None"
            }
            icon={<Calendar size={24} />}
            index={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Recent Fixtures
                </h2>
              </CardHeader>
              <CardBody>
                {dashboardStats?.recent_fixtures?.length > 0 ? (
                  <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {dashboardStats.recent_fixtures.map((fixture: any) => (
                      <li key={fixture.id} className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {fixture.home_team.name} vs {fixture.away_team.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              {fixture.venue.name} - {formatDate(fixture.fixture_date)} at {fixture.fixture_time}
                            </p>
                          </div>
                          <div className="ml-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                fixture.status === "Completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : fixture.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  : fixture.status === "Scheduled"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              {fixture.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                    No recent fixtures available
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </>
    );
  };

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
