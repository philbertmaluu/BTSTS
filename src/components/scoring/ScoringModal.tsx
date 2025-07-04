import React, { useState } from "react";
import { Save, Play, Square } from "lucide-react";
import {
  Modal,
  Button as AntButton,
  Card,
  Input,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
} from "antd";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Button } from "../ui/Button";

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
  fixture_id: string;
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
  fixture_id: "",
};

export const ScoringModal: React.FC<ScoringModalProps> = ({
  isOpen,
  onClose,
  match,
  onSaveMatch,
}) => {
  const [stats, setStats] = useState<MatchStats>(initialStats);
  const [gameStatus, setGameStatus] = useState<
    "Scheduled" | "In Progress" | "Completed"
  >("Scheduled");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Check if scoring is allowed
  const canScore = gameStatus === "In Progress";

  // Validation function
  const validateStats = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check field goals attempted (must be >= 2)
    if (stats.home_field_goals_attempted < 2) {
      errors.push("Home team field goals attempted must be at least 2");
    }
    if (stats.away_field_goals_attempted < 2) {
      errors.push("Away team field goals attempted must be at least 2");
    }

    // Check that made <= attempted for all shooting stats
    if (stats.home_field_goals_made > stats.home_field_goals_attempted) {
      errors.push("Home team field goals made cannot exceed attempted");
    }
    if (stats.away_field_goals_made > stats.away_field_goals_attempted) {
      errors.push("Away team field goals made cannot exceed attempted");
    }
    if (stats.home_three_pointers_made > stats.home_three_pointers_attempted) {
      errors.push("Home team 3-pointers made cannot exceed attempted");
    }
    if (stats.away_three_pointers_made > stats.away_three_pointers_attempted) {
      errors.push("Away team 3-pointers made cannot exceed attempted");
    }
    if (stats.home_free_throws_made > stats.home_free_throws_attempted) {
      errors.push("Home team free throws made cannot exceed attempted");
    }
    if (stats.away_free_throws_made > stats.away_free_throws_attempted) {
      errors.push("Away team free throws made cannot exceed attempted");
    }

    // Check that rebounds total = offensive + defensive
    const homeReboundsTotal =
      stats.home_rebounds_offensive + stats.home_rebounds_defensive;
    if (stats.home_rebounds_total !== homeReboundsTotal) {
      errors.push(
        "Home team total rebounds should equal offensive + defensive rebounds"
      );
    }
    const awayReboundsTotal =
      stats.away_rebounds_offensive + stats.away_rebounds_defensive;
    if (stats.away_rebounds_total !== awayReboundsTotal) {
      errors.push(
        "Away team total rebounds should equal offensive + defensive rebounds"
      );
    }

    return { isValid: errors.length === 0, errors };
  };

  // Professional NBA-style scoring functions
  const addFieldGoal = (
    team: "home" | "away",
    isThreePointer: boolean = false
  ) => {
    if (!canScore) {
      toast.error("Please start the game before scoring");
      return;
    }

    setStats((prev) => {
      const newStats = { ...prev };

      if (team === "home") {
        newStats.home_field_goals_made += 1;
        newStats.home_field_goals_attempted += 1;
        if (isThreePointer) {
          newStats.home_three_pointers_made += 1;
          newStats.home_three_pointers_attempted += 1;
        }
        // Update score internally (2 points for regular FG, 3 for three pointer)
        const points = isThreePointer ? 3 : 2;
        newStats.home_team_score += points;
      } else {
        newStats.away_field_goals_made += 1;
        newStats.away_field_goals_attempted += 1;
        if (isThreePointer) {
          newStats.away_three_pointers_made += 1;
          newStats.away_three_pointers_attempted += 1;
        }
        // Update score internally (2 points for regular FG, 3 for three pointer)
        const points = isThreePointer ? 3 : 2;
        newStats.away_team_score += points;
      }

      return newStats;
    });
  };

  const addFreeThrow = (team: "home" | "away", made: boolean) => {
    if (!canScore) {
      toast.error("Please start the game before scoring");
      return;
    }

    setStats((prev) => {
      const newStats = { ...prev };

      if (team === "home") {
        newStats.home_free_throws_attempted += 1;
        if (made) {
          newStats.home_free_throws_made += 1;
          newStats.home_team_score += 1;
        }
      } else {
        newStats.away_free_throws_attempted += 1;
        if (made) {
          newStats.away_free_throws_made += 1;
          newStats.away_team_score += 1;
        }
      }

      return newStats;
    });
  };

  const addMissedShot = (
    team: "home" | "away",
    shotType: "field_goal" | "three_pointer" | "free_throw"
  ) => {
    if (!canScore) {
      toast.error("Please start the game before scoring");
      return;
    }

    setStats((prev) => {
      const newStats = { ...prev };

      if (team === "home") {
        if (shotType === "field_goal") {
          newStats.home_field_goals_attempted += 1;
        } else if (shotType === "three_pointer") {
          newStats.home_field_goals_attempted += 1;
          newStats.home_three_pointers_attempted += 1;
        } else if (shotType === "free_throw") {
          newStats.home_free_throws_attempted += 1;
        }
      } else {
        if (shotType === "field_goal") {
          newStats.away_field_goals_attempted += 1;
        } else if (shotType === "three_pointer") {
          newStats.away_field_goals_attempted += 1;
          newStats.away_three_pointers_attempted += 1;
        } else if (shotType === "free_throw") {
          newStats.away_free_throws_attempted += 1;
        }
      }

      return newStats;
    });
  };

  const addOtherStat = (team: "home" | "away", statType: string) => {
    if (!canScore) {
      toast.error("Please start the game before scoring");
      return;
    }

    setStats((prev) => {
      const newStats = { ...prev };

      if (team === "home") {
        switch (statType) {
          case "assist":
            newStats.home_assists += 1;
            break;
          case "offensive_rebound":
            newStats.home_rebounds_offensive += 1;
            newStats.home_rebounds_total =
              newStats.home_rebounds_offensive +
              newStats.home_rebounds_defensive;
            break;
          case "defensive_rebound":
            newStats.home_rebounds_defensive += 1;
            newStats.home_rebounds_total =
              newStats.home_rebounds_offensive +
              newStats.home_rebounds_defensive;
            break;
          case "block":
            newStats.home_blocks += 1;
            break;
          case "steal":
            newStats.home_steals += 1;
            break;
          case "turnover":
            newStats.home_turnovers += 1;
            break;
          case "foul":
            newStats.home_fouls += 1;
            break;
        }
      } else {
        switch (statType) {
          case "assist":
            newStats.away_assists += 1;
            break;
          case "offensive_rebound":
            newStats.away_rebounds_offensive += 1;
            newStats.away_rebounds_total =
              newStats.away_rebounds_offensive +
              newStats.away_rebounds_defensive;
            break;
          case "defensive_rebound":
            newStats.away_rebounds_defensive += 1;
            newStats.away_rebounds_total =
              newStats.away_rebounds_offensive +
              newStats.away_rebounds_defensive;
            break;
          case "block":
            newStats.away_blocks += 1;
            break;
          case "steal":
            newStats.away_steals += 1;
            break;
          case "turnover":
            newStats.away_turnovers += 1;
            break;
          case "foul":
            newStats.away_fouls += 1;
            break;
        }
      }

      return newStats;
    });
  };

  const startGame = () => {
    setGameStatus("In Progress");
    setStats((prev) => ({
      ...prev,
      status: "In Progress",
      game_start_time: new Date().toISOString(),
    }));
    toast.success("Game started! You can now begin scoring.");
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
    toast.success("Game ended!");
  };

  const saveMatch = async () => {
    // Validate stats before saving
    const validation = validateStats();
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    setSaving(true);

    try {
      const matchStats: MatchStats = {
        ...stats,
        notes,
        fixture_id: match.id,
        home_team_score:
          (stats.home_field_goals_made - stats.home_three_pointers_made) * 2 +
          stats.home_three_pointers_made * 3 +
          stats.home_free_throws_made,
        away_team_score:
          (stats.away_field_goals_made - stats.away_three_pointers_made) * 2 +
          stats.away_three_pointers_made * 3 +
          stats.away_free_throws_made,
      };

      await onSaveMatch(matchStats);
      toast.success("Match saved successfully!");
      onClose();
    } catch (error: unknown) {
      console.error("Error saving match:", error);

      // Handle API validation errors
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: {
            data?: {
              errors?: Record<string, string[]>;
              message?: string;
            };
          };
        };

        if (apiError.response?.data?.errors) {
          const apiErrors = apiError.response.data.errors;
          Object.keys(apiErrors).forEach((field) => {
            apiErrors[field].forEach((errorMessage: string) => {
              toast.error(
                `${field
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}: ${errorMessage}`
              );
            });
          });
        } else if (apiError.response?.data?.message) {
          toast.error(apiError.response.data.message);
        } else {
          toast.error("Failed to save match. Please try again.");
        }
      } else {
        toast.error("Failed to save match. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "orange";
      case "In Progress":
        return "green";
      case "Completed":
        return "blue";
      default:
        return "default";
    }
  };

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
      <Modal
        title={
          <div>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
              Match Scoring
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#666" }}>
              {match.venue} • {new Date(match.startTime).toLocaleString()}
            </p>
          </div>
        }
        open={isOpen}
        onCancel={onClose}
        width={1200}
        maskClosable={false}
        keyboard={false}
        destroyOnClose={false}
        footer={[
          <Button
            key="cancel"
            className="mr-2"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            variant="primary"
            onClick={saveMatch}
            leftIcon={<Save size={16} />}
            isLoading={saving}
          >
            Save Match
          </Button>,
        ]}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Header with Game Status */}
          <div
            style={{
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tag
              color={getStatusColor(gameStatus)}
              style={{ fontSize: "14px", padding: "4px 12px" }}
            >
              {gameStatus}
            </Tag>

            <Space>
              {gameStatus === "Scheduled" && (
                <Button
                  variant="primary"
                  leftIcon={<Play size={16} />}
                  onClick={startGame}
                  size="sm"
                >
                  Start Game
                </Button>
              )}
              {gameStatus === "In Progress" && (
                <Button
                  variant="outline"
                  leftIcon={<Square size={16} />}
                  onClick={endGame}
                  size="sm"
                >
                  End Game
                </Button>
              )}
            </Space>
          </div>

          {/* Live Score Display */}
          <Card title="Live Score" style={{ marginBottom: 24 }}>
            <Row justify="center" align="middle" gutter={32}>
              <Col span={8} style={{ textAlign: "center" }}>
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                />
                <h4 style={{ margin: "8px 0", fontWeight: 600 }}>
                  {match.homeTeam.name}
                </h4>
                {/* <Statistic
                  value={stats.home_team_score}
                  valueStyle={{
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                /> */}

                <Statistic
                  value={
                    (stats.home_field_goals_made -
                      stats.home_three_pointers_made) *
                      2 +
                    stats.home_three_pointers_made * 3 +
                    stats.home_free_throws_made
                  }
                  valueStyle={{
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                />
              </Col>
              <Col span={4} style={{ textAlign: "center" }}>
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#999",
                    margin: 0,
                  }}
                >
                  VS
                </h2>
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                />
                <h4 style={{ margin: "8px 0", fontWeight: 600 }}>
                  {match.awayTeam.name}
                </h4>
                {/* <Statistic
                  value={stats.away_team_score}
                  valueStyle={{
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                /> */}

                <Statistic
                  value={
                    (stats.away_field_goals_made -
                      stats.away_three_pointers_made) *
                      2 +
                    stats.away_three_pointers_made * 3 +
                    stats.away_free_throws_made
                  }
                  valueStyle={{
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                />
              </Col>
            </Row>
          </Card>

          {/* Old Quick Score section removed - use Professional Scoring below */}

          {/* Professional NBA-Style Scoring Interface */}
          <Card title="Professional Scoring" style={{ marginBottom: 24 }}>
            {!canScore && (
              <div
                style={{
                  background: "#fef3c7",
                  border: "1px solid #f59e0b",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, color: "#92400e", fontWeight: 500 }}>
                  ⚠️ Scoring is disabled. Please click "Start Game" to begin
                  scoring.
                </p>
              </div>
            )}
            <Row gutter={24}>
              {/* Home Team Scoring */}
              <Col span={12}>
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: 12,
                    padding: 20,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3
                    style={{
                      textAlign: "center",
                      marginBottom: 20,
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    {match.homeTeam.name}
                  </h3>

                  {/* Field Goals */}
                  <div style={{ marginBottom: 16 }}>
                    <h4
                      style={{
                        marginBottom: 12,
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      Field Goals
                    </h4>
                    <Row gutter={8}>
                      <Col span={8}>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => addFieldGoal("home", false)}
                          className="w-full h-12 font-semibold"
                          disabled={!canScore}
                        >
                          Made (2pts)
                        </Button>
                      </Col>
                      <Col span={8}>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => addMissedShot("home", "field_goal")}
                          className="w-full h-12 font-semibold"
                          disabled={!canScore}
                        >
                          Missed
                        </Button>
                      </Col>
                      <Col span={8}>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => addFieldGoal("home", true)}
                          className="w-full h-12 font-semibold"
                          disabled={!canScore}
                        >
                          Made (3pts)
                        </Button>
                      </Col>
                    </Row>
                    <Row gutter={8} style={{ marginTop: 8 }}>
                      <Col span={8}>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => addMissedShot("home", "three_pointer")}
                          className="w-full h-12 font-semibold"
                          disabled={!canScore}
                        >
                          Missed 3pt
                        </Button>
                      </Col>
                      <Col span={8}>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => addFreeThrow("home", true)}
                          className="w-full h-12 font-semibold"
                          disabled={!canScore}
                        >
                          FT Made
                        </Button>
                      </Col>
                      <Col span={8}>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => addFreeThrow("home", false)}
                          className="w-full h-12 font-semibold"
                          disabled={!canScore}
                        >
                          FT Missed
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  {/* Other Stats */}
                  <div>
                    <h4
                      style={{
                        marginBottom: 12,
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      Other Statistics
                    </h4>
                    <Row gutter={8}>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("home", "assist")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Assist
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() =>
                            addOtherStat("home", "offensive_rebound")
                          }
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Off Reb
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() =>
                            addOtherStat("home", "defensive_rebound")
                          }
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Def Reb
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("home", "block")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Block
                        </AntButton>
                      </Col>
                    </Row>
                    <Row gutter={8} style={{ marginTop: 8 }}>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("home", "steal")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Steal
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("home", "turnover")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Turnover
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("home", "foul")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Foul
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <div
                          style={{
                            background: "#f1f5f9",
                            borderRadius: 6,
                            padding: 8,
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: 12, color: "#64748b" }}>
                            Total
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 600 }}>
                            {stats.home_field_goals_made}/
                            {stats.home_field_goals_attempted}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>

              {/* Away Team Scoring */}
              <Col span={12}>
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: 12,
                    padding: 20,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3
                    style={{
                      textAlign: "center",
                      marginBottom: 20,
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    {match.awayTeam.name}
                  </h3>

                  {/* Field Goals */}
                  <div style={{ marginBottom: 16 }}>
                    <h4
                      style={{
                        marginBottom: 12,
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      Field Goals
                    </h4>
                    <Row gutter={8}>
                      <Col span={8}>
                        <AntButton
                          type="primary"
                          size="large"
                          onClick={() => addFieldGoal("away", false)}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 50,
                            fontWeight: 600,
                          }}
                        >
                          Made (2pts)
                        </AntButton>
                      </Col>
                      <Col span={8}>
                        <AntButton
                          size="large"
                          onClick={() => addMissedShot("away", "field_goal")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 50,
                            fontWeight: 600,
                          }}
                        >
                          Missed
                        </AntButton>
                      </Col>
                      <Col span={8}>
                        <AntButton
                          type="primary"
                          size="large"
                          onClick={() => addFieldGoal("away", true)}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 50,
                            fontWeight: 600,
                          }}
                        >
                          Made (3pts)
                        </AntButton>
                      </Col>
                    </Row>
                    <Row gutter={8} style={{ marginTop: 8 }}>
                      <Col span={8}>
                        <AntButton
                          size="large"
                          onClick={() => addMissedShot("away", "three_pointer")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 50,
                            fontWeight: 600,
                          }}
                        >
                          Missed 3pt
                        </AntButton>
                      </Col>
                      <Col span={8}>
                        <AntButton
                          size="large"
                          onClick={() => addFreeThrow("away", true)}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 50,
                            fontWeight: 600,
                          }}
                        >
                          FT Made
                        </AntButton>
                      </Col>
                      <Col span={8}>
                        <AntButton
                          size="large"
                          onClick={() => addFreeThrow("away", false)}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 50,
                            fontWeight: 600,
                          }}
                        >
                          FT Missed
                        </AntButton>
                      </Col>
                    </Row>
                  </div>

                  {/* Other Stats */}
                  <div>
                    <h4
                      style={{
                        marginBottom: 12,
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      Other Statistics
                    </h4>
                    <Row gutter={8}>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("away", "assist")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Assist
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() =>
                            addOtherStat("away", "offensive_rebound")
                          }
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Off Reb
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() =>
                            addOtherStat("away", "defensive_rebound")
                          }
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Def Reb
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("away", "block")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Block
                        </AntButton>
                      </Col>
                    </Row>
                    <Row gutter={8} style={{ marginTop: 8 }}>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("away", "steal")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Steal
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("away", "turnover")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Turnover
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <AntButton
                          size="small"
                          onClick={() => addOtherStat("away", "foul")}
                          disabled={!canScore}
                          style={{
                            width: "100%",
                            height: 40,
                            fontSize: 12,
                          }}
                        >
                          Foul
                        </AntButton>
                      </Col>
                      <Col span={6}>
                        <div
                          style={{
                            background: "#f1f5f9",
                            borderRadius: 6,
                            padding: 8,
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: 12, color: "#64748b" }}>
                            Total
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 600 }}>
                            {stats.away_field_goals_made}/
                            {stats.away_field_goals_attempted}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Live Statistics Display */}
          <Card title="Live Statistics" style={{ marginBottom: 24 }}>
            <Row gutter={24}>
              <Col span={12}>
                <h4
                  style={{
                    textAlign: "center",
                    marginBottom: 16,
                    color: "#1e3a8a",
                  }}
                >
                  {match.homeTeam.name}
                </h4>
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: 8,
                    padding: 16,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#1e3a8a",
                          }}
                        >
                          {stats.home_field_goals_made}/
                          {stats.home_field_goals_attempted}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>FG</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#f59e0b",
                          }}
                        >
                          {stats.home_three_pointers_made}/
                          {stats.home_three_pointers_attempted}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          3PT
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#8b5cf6",
                          }}
                        >
                          {stats.home_free_throws_made}/
                          {stats.home_free_throws_attempted}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>FT</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={6}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#06b6d4",
                          }}
                        >
                          {stats.home_assists}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          AST
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#16a34a",
                          }}
                        >
                          {stats.home_rebounds_total}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          REB
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#ea580c",
                          }}
                        >
                          {stats.home_blocks}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          BLK
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#0891b2",
                          }}
                        >
                          {stats.home_steals}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          STL
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col span={12}>
                <h4
                  style={{
                    textAlign: "center",
                    marginBottom: 16,
                    color: "#7c2d12",
                  }}
                >
                  {match.awayTeam.name}
                </h4>
                <div
                  style={{
                    background: "#fef7ed",
                    borderRadius: 8,
                    padding: 16,
                    border: "1px solid #fed7aa",
                  }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#7c2d12",
                          }}
                        >
                          {stats.away_field_goals_made}/
                          {stats.away_field_goals_attempted}
                        </div>
                        <div style={{ fontSize: 12, color: "#a16207" }}>FG</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#f59e0b",
                          }}
                        >
                          {stats.away_three_pointers_made}/
                          {stats.away_three_pointers_attempted}
                        </div>
                        <div style={{ fontSize: 12, color: "#a16207" }}>
                          3PT
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#8b5cf6",
                          }}
                        >
                          {stats.away_free_throws_made}/
                          {stats.away_free_throws_attempted}
                        </div>
                        <div style={{ fontSize: 12, color: "#a16207" }}>FT</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={6}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#06b6d4",
                          }}
                        >
                          {stats.away_assists}
                        </div>
                        <div style={{ fontSize: 10, color: "#a16207" }}>
                          AST
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#16a34a",
                          }}
                        >
                          {stats.away_rebounds_total}
                        </div>
                        <div style={{ fontSize: 10, color: "#a16207" }}>
                          REB
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#ea580c",
                          }}
                        >
                          {stats.away_blocks}
                        </div>
                        <div style={{ fontSize: 10, color: "#a16207" }}>
                          BLK
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#0891b2",
                          }}
                        >
                          {stats.away_steals}
                        </div>
                        <div style={{ fontSize: 10, color: "#a16207" }}>
                          STL
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Notes */}
          <Card title="Match Notes">
            <Input.TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the match..."
              rows={3}
              style={{ resize: "none" }}
            />
          </Card>
        </div>
      </Modal>
    </>
  );
};
