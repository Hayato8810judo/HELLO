import { athletesFixture } from "~/data/athletes.fixture";

export interface Athlete {
  id: string;
  createdByUserId: string;
  name: string;
  nationality?: string;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAthletesByIds(athleteIds: string[]): Promise<Athlete[]> {
  return athletesFixture.filter((a) => athleteIds.includes(a.id));
}
