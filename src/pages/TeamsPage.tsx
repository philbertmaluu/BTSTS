import React, { useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

// Team data
const teams = [
	{
		id: "1",
		name: "Army Basketball Club",
		logo: "/images/ABC.jpeg",
	},
	{
		id: "2",
		name: "Chui Basketball Club",
		logo: "/images/CHUI.jpeg",
	},
	{
		id: "3",
		name: "JKT Basketball Club",
		logo: "/images/JKT.jpeg",
	},
	{
		id: "4",
		name: "Darcity Basketball Club",
		logo: "/images/DARCITY.jpeg",
	},
	{
		id: "5",
		name: "KIUT Giants Club",
		logo: "/images/KIUT.jpeg",
	},
	{
		id: "6",
		name: "Pazi Basketball Club",
		logo: "/images/PAZI.jpeg",
	},
	{
		id: "7",
		name: "UDSM Outsiders",
		logo: "/images/UDSM.jpeg",
	},
];

export const TeamsPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredTeams = teams.filter((team) =>
		team.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<Header />
			<main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
				<div className="container mx-auto px-4 py-8">
					<h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
						Basketball Dar es salaam  League Teams
					</h1>
					<div className="mb-8 flex justify-center">
						<input
							type="text"
							placeholder="Search teams..."
							className="w-full max-w-md px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex flex-col items-center gap-6">
						{filteredTeams.map((team) => (
							<div
								key={team.id}
								className="flex items-center gap-4 w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow p-4"
							>
								<img
									src={team.logo}
									alt={team.name}
									className="w-12 h-12 object-contain rounded"
								/>
								<span className="text-lg font-semibold text-neutral-900 dark:text-white">
									{team.name}
								</span>
							</div>
						))}
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
};
