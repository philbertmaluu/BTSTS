import React, { useState } from "react";
import { Plus, Minus, Save, Play, Square } from "lucide-react";
import {
  Modal,
  Button as AntButton,
  Card,
  Input,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
} from "antd";

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

  const saveMatch = () => {
    const matchStats: MatchStats = {
      ...stats,
      notes,
      home_team_score: match.homeTeam.score,
      away_team_score: match.awayTeam.score,
    };
    onSaveMatch(matchStats);
    onClose();
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
    <Row
      align="middle"
      style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
    >
      <Col span={6}>
        <span style={{ fontWeight: 500, color: "#666" }}>{label}</span>
      </Col>
      <Col span={6}>
        <Space>
          <AntButton
            size="small"
            icon={<Minus size={12} />}
            onClick={() => onHomeChange(-1)}
            style={{ width: 32, height: 32, padding: 0 }}
          />
          <span style={{ fontWeight: 600, minWidth: 48, textAlign: "center" }}>
            {homeValue}
            {showPercentage && homeValue > 0 && (
              <span style={{ fontSize: "12px", color: "#999", marginLeft: 4 }}>
                ({((homeValue / (homeValue + awayValue)) * 100).toFixed(1)}%)
              </span>
            )}
          </span>
          <AntButton
            size="small"
            icon={<Plus size={12} />}
            onClick={() => onHomeChange(1)}
            style={{ width: 32, height: 32, padding: 0 }}
          />
        </Space>
      </Col>
      <Col span={6} style={{ textAlign: "center" }}>
        <span style={{ color: "#999" }}>VS</span>
      </Col>
      <Col span={6}>
        <Space>
          <AntButton
            size="small"
            icon={<Minus size={12} />}
            onClick={() => onAwayChange(-1)}
            style={{ width: 32, height: 32, padding: 0 }}
          />
          <span style={{ fontWeight: 600, minWidth: 48, textAlign: "center" }}>
            {awayValue}
            {showPercentage && awayValue > 0 && (
              <span style={{ fontSize: "12px", color: "#999", marginLeft: 4 }}>
                ({((awayValue / (homeValue + awayValue)) * 100).toFixed(1)}%)
              </span>
            )}
          </span>
          <AntButton
            size="small"
            icon={<Plus size={12} />}
            onClick={() => onAwayChange(1)}
            style={{ width: 32, height: 32, padding: 0 }}
          />
        </Space>
      </Col>
    </Row>
  );

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
      footer={[
        <AntButton key="cancel" onClick={onClose}>
          Cancel
        </AntButton>,
        <AntButton
          key="save"
          type="primary"
          onClick={saveMatch}
          icon={<Save size={16} />}
        >
          Save Match
        </AntButton>,
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
              <AntButton
                type="primary"
                icon={<Play size={16} />}
                onClick={startGame}
                size="small"
              >
                Start Game
              </AntButton>
            )}
            {gameStatus === "In Progress" && (
              <AntButton
                icon={<Square size={16} />}
                onClick={endGame}
                size="small"
              >
                End Game
              </AntButton>
            )}
          </Space>
        </div>

        {/* Score Display */}
        <Card title="Current Score" style={{ marginBottom: 24 }}>
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
              <Statistic
                value={match.homeTeam.score}
                valueStyle={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#1890ff",
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
              <Statistic
                value={match.awayTeam.score}
                valueStyle={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#1890ff",
                }}
              />
            </Col>
          </Row>
        </Card>

        {/* Quick Score Buttons */}
        <Card title="Quick Score" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={12}>
              <h4 style={{ textAlign: "center", marginBottom: 16 }}>
                {match.homeTeam.name}
              </h4>
              <Space style={{ width: "100%", justifyContent: "center" }}>
                {[1, 2, 3].map((points) => (
                  <AntButton
                    key={`home-${points}`}
                    onClick={() => onScoreUpdate("home", points)}
                    size="large"
                    style={{ minWidth: 60 }}
                  >
                    +{points}
                  </AntButton>
                ))}
              </Space>
            </Col>
            <Col span={12}>
              <h4 style={{ textAlign: "center", marginBottom: 16 }}>
                {match.awayTeam.name}
              </h4>
              <Space style={{ width: "100%", justifyContent: "center" }}>
                {[1, 2, 3].map((points) => (
                  <AntButton
                    key={`away-${points}`}
                    onClick={() => onScoreUpdate("away", points)}
                    size="large"
                    style={{ minWidth: 60 }}
                  >
                    +{points}
                  </AntButton>
                ))}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Detailed Statistics */}
        <Card title="Detailed Statistics" style={{ marginBottom: 24 }}>
          <div>
            {/* Shooting */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 16, fontWeight: 600 }}>Shooting</h4>
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
                  updateStat("home", "home_field_goals_attempted", value)
                }
                onAwayChange={(value) =>
                  updateStat("away", "away_field_goals_attempted", value)
                }
              />
              <StatRow
                label="3-Pointers Made"
                homeValue={stats.home_three_pointers_made}
                awayValue={stats.away_three_pointers_made}
                onHomeChange={(value) =>
                  updateStat("home", "home_three_pointers_made", value)
                }
                onAwayChange={(value) =>
                  updateStat("away", "away_three_pointers_made", value)
                }
              />
              <StatRow
                label="3-Pointers Attempted"
                homeValue={stats.home_three_pointers_attempted}
                awayValue={stats.away_three_pointers_attempted}
                onHomeChange={(value) =>
                  updateStat("home", "home_three_pointers_attempted", value)
                }
                onAwayChange={(value) =>
                  updateStat("away", "away_three_pointers_attempted", value)
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
                  updateStat("home", "home_free_throws_attempted", value)
                }
                onAwayChange={(value) =>
                  updateStat("away", "away_free_throws_attempted", value)
                }
              />
            </div>

            <Divider />

            {/* Other Stats */}
            <div>
              <h4 style={{ marginBottom: 16, fontWeight: 600 }}>
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
                  updateStat("home", "home_rebounds_offensive", value)
                }
                onAwayChange={(value) =>
                  updateStat("away", "away_rebounds_offensive", value)
                }
              />
              <StatRow
                label="Defensive Rebounds"
                homeValue={stats.home_rebounds_defensive}
                awayValue={stats.away_rebounds_defensive}
                onHomeChange={(value) =>
                  updateStat("home", "home_rebounds_defensive", value)
                }
                onAwayChange={(value) =>
                  updateStat("away", "away_rebounds_defensive", value)
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
  );
};
