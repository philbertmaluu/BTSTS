import React, { useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

// Teams in the system
const teams = [
  { name: "Army Basketball Club", logo: "/images/ABC.jpeg" },
  { name: "Chui Basketball Club", logo: "/images/CHUI.jpeg" },
  { name: "JKT Basketball Club", logo: "/images/JKT.jpeg" },
  { name: "Darcity Basketball Club", logo: "/images/DARCITY.jpeg" },
  { name: "KIUT Giants Club", logo: "/images/KIUT.jpeg" },
  { name: "Pazi Basketball Club", logo: "/images/PAZI.jpeg" },
  { name: "UDSM Outsiders", logo: "/images/UDSM.jpeg" },
];

// Manually scheduled matches with assumed scores and status
const matches = [
  {
    id: "1",
    homeTeam: { ...teams[0], score: 68 },
    awayTeam: { ...teams[1], score: 62 },
    status: "played",
    date: "2025-01-01T18:00",
    venue: "Gymkhana",
  },
  {
    id: "2",
    homeTeam: { ...teams[2], score: 74 },
    awayTeam: { ...teams[3], score: 70 },
    status: "played",
    date: "2025-01-02T18:00",
    venue: "Gymkhana",
  },
  {
    id: "3",
    homeTeam: { ...teams[4], score: 59 },
    awayTeam: { ...teams[5], score: 65 },
    status: "played",
    date: "2025-01-03T18:00",
    venue: "Gymkhana",
  },
  {
    id: "4",
    homeTeam: { ...teams[0], score: 71 },
    awayTeam: { ...teams[2], score: 77 },
    status: "played",
    date: "2025-01-04T18:00",
    venue: "Gymkhana",
  },
  {
    id: "5",
    homeTeam: { ...teams[1], score: 80 },
    awayTeam: { ...teams[4], score: 66 },
    status: "played",
    date: "2025-01-05T18:00",
    venue: "Gymkhana",
  },
  {
    id: "6",
    homeTeam: { ...teams[3], score: 69 },
    awayTeam: { ...teams[5], score: 73 },
    status: "played",
    date: "2025-01-06T18:00",
    venue: "Gymkhana",
  },
  {
    id: "7",
    homeTeam: { ...teams[0], score: 82 },
    awayTeam: { ...teams[3], score: 75 },
    status: "played",
    date: "2025-01-07T18:00",
    venue: "Gymkhana",
  },
  {
    id: "8",
    homeTeam: { ...teams[1], score: 64 },
    awayTeam: { ...teams[5], score: 70 },
    status: "played",
    date: "2025-01-08T18:00",
    venue: "Gymkhana",
  },
  {
    id: "9",
    homeTeam: { ...teams[2], score: 78 },
    awayTeam: { ...teams[4], score: 60 },
    status: "played",
    date: "2025-01-09T18:00",
    venue: "Gymkhana",
  },
  // {
  //   id: "10",
  //   homeTeam: { ...teams[0], score: 75 },
  //   awayTeam: { ...teams[4], score: 68 },
  //   status: "upcoming",
  //   date: "2025-01-10T18:00",
  //   venue: "Gymkhana",
  // },
  // {
  //   id: "11",
  //   homeTeam: { ...teams[1], score: 72 },
  //   awayTeam: { ...teams[3], score: 74 },
  //   status: "upcoming",
  //   date: "2025-01-11T18:00",
  //   venue: "Gymkhana",
  // },
  // {
  //   id: "12",
  //   homeTeam: { ...teams[2], score: 69 },
  //   awayTeam: { ...teams[5], score: 71 },
  //   status: "upcoming",
  //   date: "2025-01-12T18:00",
  //   venue: "Gymkhana",
  // },
  // {
  //   id: "13",
  //   homeTeam: { ...teams[0], score: 67 },
  //   awayTeam: { ...teams[5], score: 72 },
  //   status: "upcoming",
  //   date: "2025-01-13T18:00",
  //   venue: "Gymkhana",
  // },
  // {
  //   id: "14",
  //   homeTeam: { ...teams[1], score: 61 },
  //   awayTeam: { ...teams[2], score: 79 },
  //   status: "upcoming",
  //   date: "2025-01-14T18:00",
  //   venue: "Gymkhana",
  // },
  // {
  //   id: "15",
  //   homeTeam: { ...teams[3], score: 70 },
  //   awayTeam: { ...teams[4], score: 65 },
  //   status: "upcoming",
  //   date: "2025-01-15T18:00",
  //   venue: "Gymkhana",
  // },
  {
    id: "16",
    homeTeam: { ...teams[6] },
    awayTeam: { ...teams[0]},
    status: "upcoming",
    date: "2025-07-16T18:00",
    venue: "Gymkhana",
  },
  {
    id: "17",
    homeTeam: { ...teams[6]},
    awayTeam: { ...teams[1] },
    status: "upcoming",
    date: "2025-07-17T18:00",
    venue: "Gymkhana",
  },
  {
    id: "18",
    homeTeam: { ...teams[6]},
    awayTeam: { ...teams[2] },
    status: "upcoming",
    date: "2025-07-18T18:00",
    venue: "Gymkhana",
  },
  {
    id: "19",
    homeTeam: { ...teams[6] },
    awayTeam: { ...teams[3]},
    status: "upcoming",
    date: "2025-07-19T18:00",
    venue: "Gymkhana",
  },
  {
    id: "20",
    homeTeam: { ...teams[6] },
    awayTeam: { ...teams[4] },
    status: "upcoming",
    date: "2025-07-20T18:00",
    venue: "Gymkhana",
  },
  {
    id: "21",
    homeTeam: { ...teams[6]},
    awayTeam: { ...teams[5]},
    status: "upcoming",
    date: "2025-07-21T18:00",
    venue: "Gymkhana",
  },
];

export const MatchesPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
            Match Fixtures
          </h1>
          <div className="flex flex-col gap-4 items-center">
            {matches.map((match) => (
              <div
                key={match.id}
                className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow p-4"
              >
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <img
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    className="w-10 h-10 object-contain rounded"
                  />
                  <span className="font-semibold">{match.homeTeam.name}</span>
                  <span className="font-bold text-lg ml-2">
                    {match.homeTeam.score}
                  </span>
                </div>
                <span className="mx-2 font-bold text-xl">vs</span>
                <div className="flex items-center gap-2 flex-1 justify-start">
                  <span className="font-bold text-lg mr-2">
                    {match.awayTeam.score}
                  </span>
                  <img
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    className="w-10 h-10 object-contain rounded"
                  />
                  <span className="font-semibold">{match.awayTeam.name}</span>
                </div>
                <div className="flex flex-col items-center min-w-[120px]">
                  <span className="text-sm">
                    {match.date.replace("T", " ")}
                  </span>
                  <span className="text-xs">{match.venue}</span>
                  <span
                    className={
                      match.status === "played"
                        ? "text-green-600 text-xs"
                        : "text-blue-600 text-xs"
                    }
                  >
                    {match.status === "played" ? "Played" : "Upcoming"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
