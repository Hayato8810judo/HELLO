import { bracketsFixture } from "~/data/brackets.fixture";

export interface Bracket {
  id: string;
  name: string;
  area: string;
  type: string;
  athleteIds: string[];
  matchIDs: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getBracketById(bracketId: string): Promise<Bracket | null> {
  // In a real app, you'd do DB queries or fetch from an API
  return bracketsFixture.find((b) => b.id === bracketId) || null;
}
