import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Trophy, TrendingUp } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// Mock data for players
const players = [
  {
    id: "1",
    name: "LeBron James",
    position: "SF",
    team: "Los Angeles Lakers",
    teamLogo:
      "https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg?auto=compress&cs=tinysrgb&w=800",
    image:
      "https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=800",
    stats: {
      points: 25.7,
      rebounds: 7.3,
      assists: 8.1,
      steals: 1.2,
      blocks: 0.6,
    },
    jerseyNumber: 23,
    height: "6'9\"",
    weight: "250 lbs",
    age: 39,
    experience: "20 years",
  },
  {
    id: "2",
    name: "Stephen Curry",
    position: "PG",
    team: "Golden State Warriors",
    teamLogo:
      "https://images.pexels.com/photos/5384429/pexels-photo-5384429.jpeg?auto=compress&cs=tinysrgb&w=800",
    image:
      "https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=800",
    stats: {
      points: 29.4,
      rebounds: 6.1,
      assists: 6.3,
      steals: 0.9,
      blocks: 0.4,
    },
    jerseyNumber: 30,
    height: "6'3\"",
    weight: "185 lbs",
    age: 35,
    experience: "14 years",
  },
  {
    id: "3",
    name: "Giannis Antetokounmpo",
    position: "PF",
    team: "Milwaukee Bucks",
    teamLogo:
      "https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg?auto=compress&cs=tinysrgb&w=800",
    image:
      "https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=800",
    stats: {
      points: 31.1,
      rebounds: 11.8,
      assists: 5.7,
      steals: 0.8,
      blocks: 1.3,
    },
    jerseyNumber: 34,
    height: "6'11\"",
    weight: "242 lbs",
    age: 29,
    experience: "10 years",
  },
  // Add more players as needed
];

const positions = ["All", "PG", "SG", "SF", "PF", "C"];

export const PlayersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPosition =
      positionFilter === "All" || player.position === positionFilter;

    return matchesSearch && matchesPosition;
  });

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                  Players
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  View player profiles and statistics
                </p>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search players..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {positions.map((position) => (
                  <Button
                    key={position}
                    variant="outline"
                    leftIcon={<Filter size={16} />}
                    onClick={() => setPositionFilter(position)}
                    className={
                      positionFilter === position
                        ? "bg-primary-50 dark:bg-primary-900/30"
                        : ""
                    }
                  >
                    {position}
                  </Button>
                ))}
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-4">
              {filteredPlayers.map((player) => (
                <Card key={player.id}>
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <img
                            src={player.image}
                            alt={player.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <p className="font-semibold text-neutral-900 dark:text-white">
                              {player.name}
                            </p>
                            <p className="text-neutral-600 dark:text-neutral-400">
                              #{player.jerseyNumber} • {player.position}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img
                            src={player.teamLogo}
                            alt={player.team}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {player.team}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center">
                            <Trophy className="mr-1" size={16} />
                            {player.stats.points} PPG
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="mr-1" size={16} />
                            {player.stats.rebounds} RPG
                          </div>
                        </div>
                        <span className="mt-2 px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                          {player.experience}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-sm">
                        <p className="text-neutral-500 dark:text-neutral-400">
                          Height
                        </p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {player.height}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-neutral-500 dark:text-neutral-400">
                          Weight
                        </p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {player.weight}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-neutral-500 dark:text-neutral-400">
                          Age
                        </p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {player.age}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-neutral-500 dark:text-neutral-400">
                          Assists
                        </p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {player.stats.assists} APG
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};
