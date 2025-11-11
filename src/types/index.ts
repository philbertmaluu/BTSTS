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

// Venue types
export interface Venue {
  id: number;
  name: string;
  location: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  fixtures_count?: number;
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
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  is_active?: boolean;
  deactivation_reason?: string | null;
  deactivated_at?: string | null;
  deactivated_by?: number | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  avatar?: string;
  phone?: string;
  location?: string;
}

export interface UserStats {
  total_matches: number;
  matches_won: number;
  matches_lost: number;
  total_points: number;
  average_points: number;
  total_assists: number;
  total_rebounds: number;
  total_blocks: number;
  total_steals: number;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Theme type
export type Theme = 'light' | 'dark';

// Team Stats API types
export interface TeamStats {
  id: number;
  team_id: number;
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  created_at: string;
  updated_at: string;
  team: {
    id: number;
    name: string;
    logo: string | null;
    coach_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface TeamStatsResponse {
  success: boolean;
  data: TeamStats[];
}

// Auth API types
export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pivot: {
    user_id: number;
    role_id: number;
  };
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: ApiUser;
    token: string;
    token_type: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: ApiUser;
    token: string;
    token_type: string;
  };
}