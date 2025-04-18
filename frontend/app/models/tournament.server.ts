import { tournamentsFixtures } from "~/data/tournaments.fixture";

export interface Tournament {
  id: string;
  name: string;
  location: string;
  address?: string;
  date: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  brackets: string[];
}

export async function getAllTournaments(): Promise<Tournament[]> {
  return tournamentsFixtures;
}

export async function getTournamentById(id: string): Promise<Tournament | undefined> {
  return tournamentsFixtures.find((t) => t.id == id)
}
