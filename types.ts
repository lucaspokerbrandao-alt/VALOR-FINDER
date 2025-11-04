
export interface Market {
  market: string;
  realProbability: number;
  bookmakerOdds: number;
  bookmakerName: string;
  bookmakerUrl: string;
  confidenceScore: number;
  evPercentage: number; // calculated
}

export interface Match {
  id: string; // Unique identifier for the match
  homeTeam: string;
  awayTeam: string;
  league: string;
  matchTime: string; // ISO 8601 format
  location: string; // Stadium and City
  markets: Market[]; // Array of valuable markets
}

// A Bet represents a wager placed on a specific market within a match.
export interface Bet {
  id: string;
  match: Match; // The match the bet was placed on
  market: Market; // The specific market the bet was placed on
  stake: number; // Amount wagered
  outcome: 'pending' | 'won' | 'lost'; // Status of the bet
  profit: number; // Profit or loss from the bet (can be negative)
  placedAt: string; // ISO 8601 format timestamp of when the bet was placed
}
