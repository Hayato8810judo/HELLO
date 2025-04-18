import { Link } from "@remix-run/react";
import type { Tournament } from "~/models/tournament.server";

export default function TournamentList({tournaments}: {tournaments: Tournament[]}) {
  const listItems = tournaments.map((tournament) =>
    (
      <li key={tournament.id} className="list-disc">
        <Link to={`/tournaments/${tournament.id}`}>{tournament.name} ({new Date(tournament.date).toDateString()})</Link>
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
