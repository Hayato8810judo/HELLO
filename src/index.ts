import finalhandler from "finalhandler";
import { createServer, IncomingMessage, ServerResponse } from "http";
import * as path from 'path';
// @ts-ignore
import Router from 'router';
import serveStatic from 'serve-static';
import { fileURLToPath, URL } from "url";

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const name = url.searchParams.get("name") || "world";
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, ${name}!`);
}

const router = Router();

// public フォルダを static ファイルとして提供する
router.use('/static', serveStatic(path.join(__dirname, "../public")));
router.get('/', handler);

// それ以外は 404 を返す
const server = createServer((req, res) => router(req, res, finalhandler(req, res)));

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
