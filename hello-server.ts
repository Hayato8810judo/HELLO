import { createServer, IncomingMessage, ServerResponse } from "http";

function handler(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, world!`);
}

const server = createServer(handler);

// Start the server
server.listen(3000, function() {
  console.log(`Server running at http://localhost:3000/`);
});
