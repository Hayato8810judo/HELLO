import { Link } from "@remix-run/react";
import type { Bracket } from "~/models/bracket.server";

export default function TournamentList({tournamentId, brackets}: {tournamentId: string, brackets: Bracket[]}) {
  const listItems = brackets.map((bracket) =>
    (
      <li key={bracket.id} className="list-disc">
        <Link to={`/tournaments/${tournamentId}/brackets/${bracket.id}`}>{bracket.name}</Link>
      </li>
    )
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-xl">All Tournaments</h1>
          <ul className="list-disc">
            {listItems}
          </ul>
        </div>
      </div>
    </main>
  );
}
