import { redirect } from "@remix-run/node";
import { bearerTokenCookie } from "~/cookies";

export async function loader() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await bearerTokenCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
}
