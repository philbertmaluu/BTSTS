import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for upcoming matches
const upcomingMatches = [
  {
    id: "1",
    homeTeam: {
      name: "Lakers",
      logo: "/images/lakerslogo.png",
      abbreviation: "LAL",
    },
    awayTeam: {
      name: "Warriors",
      logo: "/images/stateworiuslogo.png",
      abbreviation: "GSW",
    },
    date: "2025-05-15T19:30:00",
    location: "Staples Center, Los Angeles",
  },
  {
    id: "2",
    homeTeam: {
      name: "Celtics",
      logo: "/images/celticslogo.png",
      abbreviation: "BOS",
    },
    awayTeam: {
      name: "Heat",
      logo: "/images/heatlogo.png",
      abbreviation: "MIA",
    },
    date: "2025-05-16T20:00:00",
    location: "TD Garden, Boston",
  },
  {
    id: "3",
    homeTeam: {
      name: "Bucks",
      logo: "/images/buckslogo.png",
      abbreviation: "MIL",
    },
    awayTeam: {
      name: "Nets",
      logo: "/images/netslogo.png",
      abbreviation: "BKN",
    },
    date: "2025-05-18T19:00:00",
    location: "Fiserv Forum, Milwaukee",
  },
];

export const UpcomingMatchesSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(upcomingMatches.length / itemsPerPage);

  const visibleMatches = upcomingMatches.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Format date for display
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-10">
          <motion.h2
            className="text-3xl font-display font-bold text-neutral-900 dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Upcoming Matches
          </motion.h2>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={prevPage}
              aria-label="Previous page"
              leftIcon={<ChevronLeft size={18} />}
            />
            <Button
              variant="ghost"
              onClick={nextPage}
              aria-label="Next page"
              rightIcon={<ChevronRight size={18} />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {visibleMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={`/matches/${match.id}`}>
                  <Card
                    className="h-full"
                    motionProps={{
                      whileHover: { y: -5, transition: { duration: 0.2 } },
                    }}
                  >
                    <CardBody>
                      <p className="text-primary-500 dark:text-primary-400 text-sm mb-4">
                        {formatMatchDate(match.date)}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                            <img
                              src={match.homeTeam.logo}
                              alt={match.homeTeam.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="font-semibold text-neutral-900 dark:text-white">
                              {match.homeTeam.name}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              Home
                            </p>
                          </div>
                        </div>
                        <span className="text-xl font-display font-bold text-neutral-900 dark:text-white">
                          VS
                        </span>
                        <div className="flex items-center">
                          <div className="mr-3 text-right">
                            <p className="font-semibold text-neutral-900 dark:text-white">
                              {match.awayTeam.name}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              Away
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                            <img
                              src={match.awayTeam.logo}
                              alt={match.awayTeam.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                          {match.location}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-8">
          <Link to="/matches">
            <Button rightIcon={<ChevronRight size={18} />}>
              View All Matches
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
