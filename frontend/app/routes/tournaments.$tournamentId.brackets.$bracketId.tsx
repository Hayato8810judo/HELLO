import { json, TypedResponse } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import classNames from "classnames"

import { getTournamentById } from "~/models/tournament.server";
import { getBracketById, Bracket } from "~/models/bracket.server";
import { getMatchesByIds, Match } from "~/models/match.server";
import { getAthletesByIds, Athlete } from "~/models/athlete.server";
import { getAllClubs, Club } from "~/models/club.server";

export interface Score {
  athleteId: string;
  points: number;
}

interface ScoreboardRow {
  athleteId: string;
  wins: number;
  points: number;
}

type LoaderData = {
  athletes: Athlete[],
  bracket: Bracket,
  clubs: Club[],
  scoreboard: ScoreboardRow[];
  roundsMap: Record<number, Match[]>;
};

export async function loader({ params }: {params: Record<string, string>}): Promise<TypedResponse<LoaderData>> {
  const { tournamentId, bracketId } = params;

  if (!tournamentId || !bracketId) {
    throw new Response("Missing route params", { status: 400 });
  }

  // 1. Fetch the Tournament
  const tournament = await getTournamentById(tournamentId);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }

  // 2. Fetch the Bracket
  const bracket = await getBracketById(bracketId);
  if (!bracket) {
    throw new Response("Bracket not found", { status: 404 });
  }

  // Optionally, confirm the bracket actually belongs to this tournament
  if (!tournament.brackets.includes(bracket.id)) {
    throw new Response("This bracket does not belong to the specified tournament", {
      status: 400,
    });
  }

  // 3. Matches + Athletes + Clubs
  const bracketMatches = await getMatchesByIds(bracket.matchIDs);
  const bracketAthletes = await getAthletesByIds(bracket.athleteIds);
  const clubs = await getAllClubs();

  // 4. Compute scoreboard
  const scoreboard = bracketAthletes.map((athlete) => {
    const wins = bracketMatches.filter((m) => m.winner === athlete.id).length;
    const points = bracketMatches.reduce((sum, match) => {
      const sc = match.score.find((s) => s.athleteId === athlete.id);
      return sum + (sc?.points || 0);
    }, 0);

    return { athleteId: athlete.id, wins, points };
  });
  scoreboard.sort((a, b) => (b.wins === a.wins ? b.points - a.points : b.wins - a.wins));

  // 5. Group matches by round
  const roundsMap: Record<number, typeof bracketMatches> = {};
  for (const m of bracketMatches) {
    if (!roundsMap[m.round]) {
      roundsMap[m.round] = [];
    }
    roundsMap[m.round].push(m);
  }

  return json({
    bracket,
    athletes: bracketAthletes,
    clubs,
    scoreboard,
    roundsMap,
  });
}

export default function BracketPage() {
  const {
    bracket,
    athletes,
    clubs,
    scoreboard,
    roundsMap,
  } = useLoaderData<LoaderData>();

  const [hoveredAthlete, setHoveredAthlete] = useState<string | null>(null);

  // Helper to find a club name
  function getClubName(clubId: string): string {
    const club = clubs.find((c) => c.id === clubId);
    return club ? club.name : "";
  }

  // Helper to find an athlete object by ID
  function findAthlete(athleteId: string) {
    return athletes.find((a) => a.id === athleteId);
  }

  // Helper to get an athlete's points in a particular match
  function getScoreForAthlete(match: any, athleteId: string) {
    const sc = match.score.find((s: any) => s.athleteId === athleteId);
    return sc ? sc.points : 0;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Bracket Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{bracket.name}</h2>
        <div className="mt-1 text-sm text-neutral-400 space-x-4">
          <span>Area: {bracket.area}</span>
          <span>Type: {bracket.type}</span>
          <span>Participants: {athletes.length}</span>
        </div>
      </div>

      {/* Single Standings Table (with nationality) */}
      <div className="overflow-x-auto mb-8">
        <table
          onMouseLeave={() => setHoveredAthlete(null)}
          className="w-full table-auto border-collapse bg-neutral-800 text-sm"
        >
          <thead>
            <tr className="bg-neutral-700 text-left">
              <th className="py-2 px-3 font-medium">#</th>
              <th className="py-2 px-3 font-medium">Name</th>
              <th className="py-2 px-3 font-medium">Club</th>
              <th className="py-2 px-3 font-medium">Nationality</th>
              <th className="py-2 px-3 font-medium">Wins</th>
              <th className="py-2 px-3 font-medium">Points</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((row, idx) => {
              const athlete = findAthlete(row.athleteId);
              return (
                <tr
                  key={row.athleteId}
                  onMouseEnter={() => setHoveredAthlete(row.athleteId)}
                  className={classNames("border-b border-neutral-700 hover:bg-neutral-750 cursor-pointer", {
                    "bg-blue-500": hoveredAthlete === row.athleteId,
                  })}
                >
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3">{athlete?.name ?? "Unknown"}</td>
                  <td className="py-2 px-3">
                    {athlete ? getClubName(athlete.clubId) : ""}
                  </td>
                  <td className="py-2 px-3">
                    {athlete?.nationality ?? "—"}
                  </td>
                  <td className="py-2 px-3">{row.wins}</td>
                  <td className="py-2 px-3">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* If desired, we can still display matches by round */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(roundsMap)
          .sort(([roundA], [roundB]) => Number(roundA) - Number(roundB))
          .map(([roundNum, matchList]) => {
            const numericRound = Number(roundNum);
            return (
              <div key={numericRound}>
                <h3 className="font-semibold mb-3">Round {numericRound}</h3>
                <div className="space-y-2">
                  {matchList.map((m) => (
                    <div
                      key={m.id}
                      className={classNames("p-3 rounded shadow text-xs text-neutral-300", {
                        "bg-blue-500": m.athletes.includes(hoveredAthlete),
                        "bg-neutral-800 ": !m.athletes.includes(hoveredAthlete),
                        })
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span>Match {m.match}</span>
                        <span className="text-neutral-500">
                          {m.duration} / {m.start.substring(11, 16)}
                        </span>
                      </div>
                      {m.athletes.map((athId) => {
                        const a = findAthlete(athId);
                        const isWinner = m.winner === athId;
                        return (
                          <div
                            key={athId}
                            className={`flex justify-between ${
                              isWinner ? "font-semibold text-white" : ""
                            }`}
                          >
                            <span>{a?.name ?? "Unknown"}</span>
                            <span>{getScoreForAthlete(m, athId)}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
