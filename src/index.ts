import { aboutHandler, listAllUsers, updateUserProfile } from "./about";
import * as authentication from "./authentication";
import finalHandler from "finalhandler";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { join } from "path";
import rootHandler from "./root";
// @ts-ignore
import Router from "router";
import serveStatic from "serve-static";
import { fileURLToPath, URL } from "url";

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const name = authentication.getLoggedInUser(req.headers.cookie);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, ${name}`);
}

function aboutHandler(req: IncomingMessage, res: ServerResponse) {
  ejs.renderFile(
    path.join(__dirname, "views", "about.ejs"),
    { name: "Hayato", interests: "Coding" },
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
router.use("/static", serveStatic(join(__dirname, "./public")));
router.get("/", rootHandler);
router.get("/about", aboutHandler);
router.get("/about/users", listAllUsers);
router.post("/about/user", updateUserProfile);
router.get("/login", authentication.loginPage);
router.post("/login", authentication.login);
router.get("/login/token", authentication.claim);
router.get("/logout", authentication.logout);

const server = createServer((req, res) => router(req, res, finalHandler(req, res)));

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
