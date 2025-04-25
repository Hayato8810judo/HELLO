import { json, TypedResponse } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import TournamentList from "~/components/tournament-list";
import { getAllTournaments, Tournament } from "~/models/tournament.server";

export async function loader(): Promise<TypedResponse<Tournament[]>> {
  const tournaments = await getAllTournaments();
  return json(tournaments);
}

export default function IndexPage() {
  const tournaments = useLoaderData<typeof loader>();

  return (
    <TournamentList tournaments={tournaments}/>
  );
}

