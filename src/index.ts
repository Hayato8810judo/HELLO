import ejs from "ejs";
import finalHandler from "finalhandler";
import { createServer, IncomingMessage, ServerResponse } from "http";
import path from "path";
// @ts-ignore
import Router from "router";
import serveStatic from "serve-static";
import { fileURLToPath, URL } from "url";
import * as authentication from "./authentication";

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const email: string | null = req.headers.cookie == null ? null : authentication.getLoggedInUser(req.headers.cookie);
  const name = email ?? url.searchParams.get("name") ?? "world";
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, ${name}!`);
}

function aboutHandler(req: IncomingMessage, res: ServerResponse) {
  ejs.renderFile(
    path.join(__dirname, "views", "about.ejs"),
    { name: "Hayato", interests: "coding" },
    (err: Error | null, aboutData: string) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error rendering EJS: " + err.message);
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(aboutData);
    }
  );
}

const router = Router();
router.use("/static", serveStatic(path.join(__dirname, "./public")));
router.get("/about", aboutHandler);
router.get("/", handler);

const server = createServer((req, res) => router(req, res, finalHandler(req, res)));


router.get('/login', authentication.loginPage);
router.post('/login', authentication.login);
router.get('/login/:token', authentication.claim);
router.get('/logout', authentication.logout);

// それ以外は 404 を返す
const server = createServer((req, res) => router(req, res, finalhandler(req, res)));

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
