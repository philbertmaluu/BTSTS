import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// Mock data for matches - in a real app, this would come from an API
const matches = [
  {
    id: "1",
    homeTeam: {
      name: "Lakers",
      score: 98,
      logo: "/images/lakerslogo.png",
    },
    awayTeam: {
      name: "Warriors",
      score: 102,
      logo: "/images/stateworiuslogo.png",
    },
    status: "completed",
    date: "2024-05-15T19:30:00",
    venue: "Staples Center",
  },
  {
    id: "2",
    homeTeam: {
      name: "Lakers",
      score: 0,
      logo: "/images/lakerslogo.png",
    },
    awayTeam: {
      name: "Warriors",
      score: 0,
      logo: "/images/stateworiuslogo.png",
    },
    status: "scheduled",
    date: "2024-05-16T20:00:00",
    venue: "Chase Center",
  },
  // Add more matches as needed
];

export const MatchesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || match.status === statusFilter;

    return matchesSearch && matchesStatus;
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
                  Matches
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  View and track all basketball matches
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
                  placeholder="Search matches..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  leftIcon={<Filter size={16} />}
                  onClick={() => setStatusFilter("all")}
                  className={
                    statusFilter === "all"
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Calendar size={16} />}
                  onClick={() => setStatusFilter("scheduled")}
                  className={
                    statusFilter === "scheduled"
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : ""
                  }
                >
                  Upcoming
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("completed")}
                  className={
                    statusFilter === "completed"
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : ""
                  }
                >
                  Completed
                </Button>
              </div>
            </div>

            {/* Matches List */}
            <div className="space-y-4">
              {filteredMatches.map((match) => (
                <Card key={match.id}>
                  <CardBody>
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
                          {formatMatchDate(match.date)}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {match.status === "completed"
                            ? "Completed"
                            : "Upcoming"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      {match.venue}
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
