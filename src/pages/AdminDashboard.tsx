import React, { useState, useEffect } from "react";

// Example data structures
type Team = { id: string; name: string; logo: string };
type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  status: string;
};

// Sample initial data
const initialTeams: Team[] = [
  { id: "1", name: "Arsenal", logo: "https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png" },
  { id: "2", name: "Chelsea", logo: "https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png" },
  { id: "3", name: "Liverpool", logo: "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png" },
];

const initialMatches: Match[] = [
  {
    id: "1",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    date: "2025-06-25T15:00",
    venue: "Emirates Stadium",
    status: "upcoming"
  },
  {
    id: "2",
    homeTeam: "Liverpool",
    awayTeam: "Arsenal",
    date: "2025-06-20T14:00",
    venue: "Anfield",
    status: "played"
  }
];

export default function AdminDashboard() {
  // Teams state
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState({ name: "", logo: "" });

  // Matches state
  const [matches, setMatches] = useState<Match[]>([]);
  const [newMatch, setNewMatch] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    venue: "",
    status: "upcoming",
  });

  // Initialize with sample data
  useEffect(() => {
    setTeams(initialTeams);
    setMatches(initialMatches);
  }, []);

  // CRUD for Teams
  const addTeam = () => {
    if (!newTeam.name || !newTeam.logo) return;
    const updatedTeams = [...teams, { id: Date.now().toString(), ...newTeam }];
    setTeams(updatedTeams);
    setNewTeam({ name: "", logo: "" });
  };

  const deleteTeam = (id: string) => {
    const updatedTeams = teams.filter((t) => t.id !== id);
    setTeams(updatedTeams);
  };

  // CRUD for Matches
  const addMatch = () => {
    if (
      !newMatch.homeTeam ||
      !newMatch.awayTeam ||
      !newMatch.date ||
      !newMatch.venue
    )
      return;
    const updatedMatches = [...matches, { id: Date.now().toString(), ...newMatch }];
    setMatches(updatedMatches);
    setNewMatch({
      homeTeam: "",
      awayTeam: "",
      date: "",
      venue: "",
      status: "upcoming",
    });
  };

  const deleteMatch = (id: string) => {
    const updatedMatches = matches.filter((m) => m.id !== id);
    setMatches(updatedMatches);
  };

  // Simple report: total teams and matches
  const report = {
    totalTeams: teams.length,
    totalMatches: matches.length,
    played: matches.filter((m) => m.status === "played").length,
    upcoming: matches.filter((m) => m.status === "upcoming").length,
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Teams CRUD */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Teams Management</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Team Name"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Logo URL"
            value={newTeam.logo}
            onChange={(e) => setNewTeam({ ...newTeam, logo: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={addTeam} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Team
          </button>
        </div>
        <div className="grid gap-2">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/40x40?text=?";
                }}
              />
              <span className="font-medium text-gray-700 flex-1">{team.name}</span>
              <button
                onClick={() => deleteTeam(team.id)}
                className="text-red-500 hover:text-red-700 px-3 py-1 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Matches CRUD */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Match Fixtures</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          <select
            value={newMatch.homeTeam}
            onChange={(e) => setNewMatch({ ...newMatch, homeTeam: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Home Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
          <select
            value={newMatch.awayTeam}
            onChange={(e) => setNewMatch({ ...newMatch, awayTeam: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Away Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={newMatch.date}
            onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Venue"
            value={newMatch.venue}
            onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newMatch.status}
            onChange={(e) => setNewMatch({ ...newMatch, status: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="played">Played</option>
          </select>
          <button 
            onClick={addMatch} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors col-span-2 md:col-span-1"
          >
            Add Match
          </button>
        </div>
        <div className="space-y-2">
          {matches.map((match) => (
            <div key={match.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {match.homeTeam} vs {match.awayTeam}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(match.date).toLocaleString()} | {match.venue} | 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    match.status === 'played' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {match.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteMatch(match.id)}
                className="text-red-500 hover:text-red-700 px-3 py-1 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Reports */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Reports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-blue-600">{report.totalTeams}</div>
            <div className="text-sm text-gray-600">Total Teams</div>
          </div>
          <div className="bg-green-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-green-600">{report.totalMatches}</div>
            <div className="text-sm text-gray-600">Total Matches</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-purple-600">{report.played}</div>
            <div className="text-sm text-gray-600">Played Matches</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-orange-600">{report.upcoming}</div>
            <div className="text-sm text-gray-600">Upcoming Matches</div>
          </div>
        </div>
      </section>
    </div>
  );
}