import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getConfig } from "~/config";
import { bearerTokenCookie } from "~/cookies";

export async function loader({ params }: LoaderFunctionArgs) {
  const { token } = params;
  const { API_BASE_URL } = getConfig();

  if (token == null) {
    throw new Response("Missing token", { status: 400 });
  }

  // Redeem the claim token for a session token
  const res = await fetch(`${API_BASE_URL}/authn-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    return redirect("/login?error=invalid-token");
  }

  const jsonResponse = await res.json();
  const bearerToken = jsonResponse["access_token"];
  if (bearerToken == null) {
    return redirect("/login?error=missing-token");
  }

  const cookieHeader = await bearerTokenCookie.serialize(bearerToken);
  const headers = { "Set-Cookie": cookieHeader };
  const response = { headers };
  return redirect("/", response);
}
