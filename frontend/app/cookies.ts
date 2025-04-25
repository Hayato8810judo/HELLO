import { createCookie } from "@remix-run/node";

export const bearerTokenCookie = createCookie("bearer_token", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365 * 10,
});
