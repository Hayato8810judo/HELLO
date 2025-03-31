import anyBody from 'body/any';
import * as cookie from 'cookie';
import ejs from "ejs"
import { IncomingMessage, ServerResponse } from "http";
import jwt, { TokenExpiredError, JsonWebTokenError, SignOptions } from "jsonwebtoken";
import * as path from 'path';
import { parse as parseQuery } from 'querystring';
import { parse as parseUrl } from 'url';

import type { SerializeOptions } from 'cookie';
import type { StringValue } from "ms";

export const COOKIE_NAME = "session";
const COOKIE_OPTIONS: SerializeOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'strict',
  secure: true,
};

const LOGIN_VIEW_PATH = path.join(__dirname, 'views', 'login.ejs');

const JWT_CLAIM_SECRET: string = process.env.JWT_CLAIM_SECRET ?? (() => {
  throw new Error("Missing JWT_CLAIM_SECRET environment variable");
})();

const JWT_SESSION_SECRET: string = process.env.JWT_SESSION_SECRET ?? (() => {
  throw new Error("Missing JWT_SESSION_SECRET environment variable");
})();

export function getLoggedInUser(cookieString: string): string | null {
  const cookies = cookie.parse(cookieString);
  const encodedCookieToken: string | undefined = cookies[COOKIE_NAME];
  if (encodedCookieToken == null) return null;
  try {
    const claim = jwt.verify(encodedCookieToken, JWT_SESSION_SECRET)
    if (typeof claim === "string") throw new Error("claim should be an object");
    if (claim.email == null) throw new Error("email expected in claim token");
    return claim.email;
  } catch (e) {
    return null;
  }
}

function generateToken(email: string, expiresIn: StringValue, secret: string): string {
  const payload = { email };
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

export async function loginPage(req: IncomingMessage, res: ServerResponse) {
  ejs.renderFile(LOGIN_VIEW_PATH, { state: 'INITIAL' }, function(err: Error | null, html: string) {
    if (err !== null) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end(`Error rendering EJS: ${err.message}`);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
}

export async function login(req: IncomingMessage, res: ServerResponse) {
  anyBody(req, function(err, body) {
    if (err !== null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid body" }));
      return;
    }

    const email = (body as Record<string, string>)["email"];
    if (email == null || email === "") {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Email is required" }));
      return;
    }

    const authnClaimToken: string = generateToken(email, "10m", JWT_CLAIM_SECRET);
    const magicLink: string = `http://localhost:3000/login/${authnClaimToken}`;

    if (process.env.NODE_ENV !== "production") {
      console.log(`Magic link for ${email}: ${magicLink}`);
    }

    ejs.renderFile(LOGIN_VIEW_PATH, { state: 'LINK_SENT', email }, (err: Error | null, html: string) => {
      if (err !== null) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end(`Error rendering EJS: ${err.message}`);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
  });
}

export async function claim(req: IncomingMessage & { params: {"token": string} }, res: ServerResponse) {
  try {
    const encodedToken: string | undefined = req.params["token"];
    if (encodedToken == null) throw new Error("expected params['token'] to exist");

    const claim = jwt.verify(encodedToken, JWT_CLAIM_SECRET)
    if (typeof claim === "string") throw new Error("claim should be an object");
    if (claim.email == null) throw new Error("email expected in claim token");

    const sessionToken: string = generateToken(claim.email, "7d", JWT_SESSION_SECRET);
    const cookieValue = cookie.serialize(COOKIE_NAME, sessionToken, COOKIE_OPTIONS);
    res.setHeader('Set-Cookie', cookieValue);
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
    return;
  } catch (err: unknown) {
    if (err instanceof TokenExpiredError) {
      const data = { state: 'INITIAL', error: "Magic link expired. Please try again." };
      ejs.renderFile(LOGIN_VIEW_PATH, data, function(err: Error | null, html: string) {
        if (err !== null) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          return res.end(`Error rendering EJS: ${err.message}`);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      });
      return;
    }

    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("something went wrong");
    return;
  }
}

export async function logout(req: IncomingMessage, res: ServerResponse) {
  const cookieValue = cookie.serialize(COOKIE_NAME, '', COOKIE_OPTIONS);
  res.setHeader('Set-Cookie', cookieValue);
  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
}
