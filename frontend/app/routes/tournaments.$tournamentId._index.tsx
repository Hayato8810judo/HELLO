import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "~/utils/invariant";

import { getTournamentById } from "~/models/tournament.server";
import { getBracketById } from "~/models/bracket.server";
import BracketList from "~/components/bracket-list";

export async function loader({ params }: {params: Record<string, string>}) {
  const { tournamentId } = params;

  if (!tournamentId) {
    throw new Response("Missing route params", { status: 400 });
  }

  const tournament = await getTournamentById(tournamentId);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }

  const brackets = await Promise.all(tournament.brackets.map((id) => getBracketById(id)));
  invariant(brackets.every(b => b != null), "Expected a non-null bracket.");

  return json({tournamentId: tournament.id, brackets});
}

export default function TournamentPage() {
  const { brackets, tournamentId } = useLoaderData<typeof loader>();
  return (
    <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
      <div>
        <h1 className="text-xl">All Brackets</h1>
        <BracketList tournamentId={tournamentId} brackets={brackets}/>
      </div>
    </div>
  );
}
