import { json, TypedResponse } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { getTournamentById, Tournament } from "~/models/tournament.server";

export async function loader({ params }: {params: Record<string, string>}): Promise<TypedResponse<Tournament>> {
  const { tournamentId } = params;

  if (!tournamentId) {
    throw new Response("Missing route params", { status: 400 });
  }

  const tournament = await getTournamentById(tournamentId);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }

  return json(tournament);
}

export default function TournamentPage() {
  const tournament = useLoaderData<Tournament>();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <section className="bg-neutral-800 p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{tournament.name}</h1>
          <p className="text-sm text-neutral-400">
            {tournament.location} • {new Date(tournament.date).toDateString()}
          </p>
        </div>
      </section>
      <Outlet />
    </main>
  );
}
