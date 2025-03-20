import { createServer, IncomingMessage, ServerResponse } from "http";
import path from 'path';
import finalhandler from "finalhandler"
// @ts-ignore
import Router from 'router';
import serveStatic from 'serve-static';
import { URL } from "url";

console.log(`Running in ${process.env.NODE_ENV} mode`);

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const name = url.searchParams.get("name") || "world";

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, ${name}!`);
}

const router = Router();

router.use('/static', serveStatic(path.join(process.cwd(), 'public')))
router.get('/', handler);
const server = createServer((req, res) => router(req, res, finalhandler(req, res)));

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
