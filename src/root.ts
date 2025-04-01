import { getLoggedInUser} from "./authentication";
import { URL } from "url";
import type { IncomingMessage, ServerResponse } from "http";

export function rootHandler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const email: string | null = req.headers.cookie == null
    ? null
    : getLoggedInUser(req.headers.cookie);
  const name = email ?? url.searchParams.get("name") ?? "world";
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, ${name}!`);
}

