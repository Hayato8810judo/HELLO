import { clubsFixture } from "~/data/clubs.fixture";

export interface Club {
  id: string;
  name: string;
  website?: string;
  phone?: string;
  location?: string;
  description?: string;
}

export async function getAllClubs(): Promise<Club[]> {
  return clubsFixture;
}
