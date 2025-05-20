import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Trophy, TrendingUp } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// Mock data for teams
const teams = [
  {
    id: "1",
    name: "Los Angeles Lakers",
    logo: "/images/lakerslogo.png",
    city: "Los Angeles",
    conference: "Western",
    division: "Pacific",
    stats: {
      wins: 42,
      losses: 30,
      winPercentage: 0.583,
      streak: "W3",
      lastTen: "7-3",
    },
    recentResults: ["W", "W", "W", "L", "W"],
  },
  {
    id: "2",
    name: "Boston Celtics",
    logo: "/images/celticslogo.png",
    city: "Boston",
    conference: "Eastern",
    division: "Atlantic",
    stats: {
      wins: 48,
      losses: 24,
      winPercentage: 0.667,
      streak: "L1",
      lastTen: "6-4",
    },
    recentResults: ["L", "W", "W", "W", "W"],
  },
  {
    id: "3",
    name: "Golden State Warriors",
    logo: "/images/stateworiuslogo.png",
    city: "San Francisco",
    conference: "Western",
    division: "Pacific",
    stats: {
      wins: 38,
      losses: 34,
      winPercentage: 0.528,
      streak: "W2",
      lastTen: "5-5",
    },
    recentResults: ["W", "W", "L", "L", "W"],
  },
  // Add more teams as needed
];

export const TeamsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conferenceFilter, setConferenceFilter] = useState("All");

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesConference =
      conferenceFilter === "All" || team.conference === conferenceFilter;

    return matchesSearch && matchesConference;
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
            {/* Header Section */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                NBA Teams
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Explore all NBA teams, their stats, and recent performance
              </p>
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
                  placeholder="Search teams..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConferenceFilter("All")}
                  className={
                    conferenceFilter === "All"
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConferenceFilter("Eastern")}
                  className={
                    conferenceFilter === "Eastern"
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : ""
                  }
                >
                  Eastern
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConferenceFilter("Western")}
                  className={
                    conferenceFilter === "Western"
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : ""
                  }
                >
                  Western
                </Button>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-600">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  </div>
                  <CardBody>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      {team.name}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      {team.city} • {team.conference} Conference
                    </p>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Trophy className="text-primary-500" size={20} />
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Record
                          </p>
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {team.stats.wins}-{team.stats.losses}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="text-primary-500" size={20} />
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Win %
                          </p>
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {(team.stats.winPercentage * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Results */}
                    <div className="mb-4">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        Recent Results
                      </p>
                      <div className="flex space-x-2">
                        {team.recentResults.map((result, index) => (
                          <span
                            key={index}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                              result === "W"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      View Team Details
                    </Button>
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
