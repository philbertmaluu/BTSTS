// Team types
export interface Team {
  id: string;
  name: string;
  logo: string;
  city: string;
  abbreviation: string;
  primaryColor: string;
  secondaryColor: string;
  conference: 'East' | 'West';
  division: string;
  wins: number;
  losses: number;
}

// Player types
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  height: string;
  weight: string;
  birthdate: string;
  teamId: string;
  image: string;
}

export interface PlayerStats {
  playerId: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  minutesPlayed: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
}

// Match types
export interface MatchEvent {
  id: string;
  matchId: string;
  eventType: 'score' | 'foul' | 'timeout' | 'substitution' | 'quarter_start' | 'quarter_end' | 'match_start' | 'match_end';
  timestamp: string;
  playerId?: string;
  teamId: string;
  points?: number;
  description: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  location: string;
  homeTeamScore: number;
  awayTeamScore: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  currentQuarter: number;
  timeRemaining: string;
  events: MatchEvent[];
}

// News types
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  tags: string[];
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'statistician' | 'coach' | 'fan';
  teamId?: string;
  avatar?: string;
}

// Theme type
export type Theme = 'light' | 'dark';