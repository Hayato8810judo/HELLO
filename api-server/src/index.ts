import * as authentication from "./authentication";
// @ts-ignore
import Router from "router";
import ejs from "ejs";
import finalHandler from "finalhandler";
import rootHandler from "./root";
import serveStatic from "serve-static";
import { aboutHandler, listAllUsers, updateUserProfile } from "./about";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { fileURLToPath, URL } from "url";
import { dirname, join } from "path";


function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const nameFromCookie = req.headers.cookie != null
    ? authentication.getLoggedInUser(req.headers.cookie)
    : null;
  const name = nameFromCookie || url.searchParams.get("name") || "world";
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, ${name}`);
}

const router = Router();

// public フォルダを static ファイルとして提供する
router.use('/static', serveStatic(join(__dirname, "../public")));
router.get('/', rootHandler);

router.get('/about', listAllUsers);
router.get('/about/:user', aboutHandler);
router.post('/about/:user', updateUserProfile);

router.post("/authn-claim", authentication.createClaim);         // create authn-claim
router.post("/authn-session", authentication.createSession);     // create authn-session
router.get("/authn-session/:token", authentication.readSession); // read authn-session (whoami)

const server = createServer((req, res) => router(req, res, finalHandler(req, res)));

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});

