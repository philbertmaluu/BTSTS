// import React from 'react';






// const TeamStandings: React.FC = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Dar es Salaam League Standings 2025</h1>
      
//     </div>
//   );
// };

// export default TeamStandings;
import React from "react";
import { motion } from "framer-motion";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card } from "../components/ui/Card";

interface Team {
  rank: number;
  team: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
}

const teamData: Team[] = [
  { rank: 1, team: "Army Basketball Club", played: 8, wins: 8, losses: 0, points: 16 },
  { rank: 2, team: "Chui Basketball Club", played: 8, wins: 6, losses: 2, points: 14 },
  { rank: 3, team: "JKT Basketball Club", played: 8, wins: 5, losses: 3, points: 13 },
  { rank: 4, team: "Darcity Basketball Ckub", played: 8, wins: 4, losses: 4, points: 12 },
  { rank: 5, team: "KIUT Giants Club", played: 8, wins: 2, losses: 6, points: 10 },
  { rank: 6, team: "Pazi Basketball Club", played: 8, wins: 2, losses: 6, points: 10 },
  { rank: 7, team: "UDSM Outsiders", played: 8, wins: 2, losses: 6, points: 10 },
];

const TeamStandingsPage: React.FC = () => {
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
                  Team Standings
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Current standings for the Basketball Development League
                </p>
              </div>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-900 dark:text-white">#</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-900 dark:text-white">Team</th>
                      <th className="px-4 py-3 text-center font-semibold text-neutral-900 dark:text-white">Played</th>
                      <th className="px-4 py-3 text-center font-semibold text-neutral-900 dark:text-white">Wins</th>
                      <th className="px-4 py-3 text-center font-semibold text-neutral-900 dark:text-white">Losses</th>
                      <th className="px-4 py-3 text-center font-semibold text-neutral-900 dark:text-white">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {teamData.map((team, index) => (
                      <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 text-neutral-900 dark:text-white">{team.rank}</td>
                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{team.team}</td>
                        <td className="px-4 py-3 text-center text-neutral-900 dark:text-white">{team.played}</td>
                        <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-medium">{team.wins}</td>
                        <td className="px-4 py-3 text-center text-red-600 dark:text-red-400 font-medium">{team.losses}</td>
                        <td className="px-4 py-3 text-center font-semibold text-primary-600 dark:text-primary-400">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TeamStandingsPage;