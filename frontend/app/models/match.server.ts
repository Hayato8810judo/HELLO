import { matchesFixture } from "~/data/matches.fixture";

export interface MatchScore {
  athleteId: string;
  points: number;
}

export interface Match {
  id: string;
  athletes: string[]; // 2 athlete IDs
  match: number;      // match number
  round: number;      // round number
  start: string;      // date/time
  duration: string;   // e.g. "00:06"
  winner: string;     // athlete ID
  score: MatchScore[];
}

export async function getMatchesByIds(matchIds: string[]): Promise<Match[]> {
  return matchesFixture.filter((m) => matchIds.includes(m.id));
}
