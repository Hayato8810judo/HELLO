import { getLoggedInUser } from "./authentication";
import anyBody from 'body/any';
import ejs from "ejs"
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { findUserByEmail, getAllUsers, updateUserByEmail } from "./user-store"

import type { IncomingMessage, ServerResponse } from "http";

const ABOUT_VIEW_PATH = join(__dirname, 'views', 'user', 'user.ejs');
const USER_LISTING_VIEW_PATH = join(__dirname, 'views', 'user', 'index.ejs');

export function listAllUsers(req: IncomingMessage, res: ServerResponse) {
  const data = { users: getAllUsers() };
  ejs.renderFile(USER_LISTING_VIEW_PATH, data, (err: Error|null, html: string) => {
    if (err !== null) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end(`Error rendering EJS: ${err.message}`);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
}

export function updateUserProfile(req: IncomingMessage & { params: { user: string } }, res: ServerResponse) {
  const loggedInUserEmail: string | null = req.headers.cookie == null ? null : getLoggedInUser(req.headers.cookie);
  if (loggedInUserEmail == null) {
    res.writeHead(401, { "Content-Type": "text/plain" });
    res.end("You must be logged in.");
    return
  }

  anyBody(req, function(err, body) {
    if (err !== null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid body" }));
      return;
    }

    const user = findUserByEmail(loggedInUserEmail);
    if (user == null) throw new Error(`Cann't find user for ${loggedInUserEmail}`);
    const { name, interest } = (body as Record<string, string>);
    updateUserByEmail(loggedInUserEmail, { name, interest })
    res.statusCode = 302;
    res.setHeader('Location', `/about/${loggedInUserEmail}`);
    res.end();
    return
  });
}

export function aboutHandler(req: IncomingMessage & { params: { user: string } }, res: ServerResponse) {
  const profileUserEmail: string | undefined = req.params["user"];
  if (profileUserEmail == null) throw new Error("expected params['user'] to exist");

  const loggedInUserEmail: string | null = req.headers.cookie == null ? null : getLoggedInUser(req.headers.cookie);

  const profileUser = findUserByEmail(profileUserEmail);
  if (profileUser == null) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(`Cannot find user ${profileUserEmail}!`);
    return
  }
  const aboutData = { loggedInUserEmail, profileUser };

  ejs.renderFile(ABOUT_VIEW_PATH, aboutData, (err: Error|null, html: string) => {
    if (err !== null) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end(`Error rendering EJS: ${err.message}`);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
}
