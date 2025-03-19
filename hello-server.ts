import { createServer, IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const name = url.searchParams.get("name") || "world";

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, ${name}!`);
}

const server = createServer(handler);

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});

