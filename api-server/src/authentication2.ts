import anyBody from 'body/any';
import * as cookie from 'cookie';
import { IncomingMessage, ServerResponse } from "http";
import jwt, { TokenExpiredError, JsonWebTokenError, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';

const JWT_SECRET: string = process.env.JWT_SECRET ?? (() => {
  throw new Error("Missing JWT_SECRET environment variable");
})();

export const COOKIE_NAME = "session";

/** Request and Response Types */
interface AuthenticationRequest {
  email: string;
}

interface AuthenticationResponse {
  message: string;
}

interface AuthenticationReadParams {
  "*": string;
}

interface AuthenticationReadQuery {
  "redirect-to"?: string;
}

interface DecodedJWT {
  email: string;
  expiration: number;
  type: "authn" | "authn-claim";
}

interface AuthenticationUpdateParams {
  "*": string;
}

interface AuthenticationUpdateResponse {
  message: string;
  token: string;
}

interface AuthenticationDeleteResponse {
  message: string;
}


type TokenPathParam = { params: {"token": string} };













/** Generates a JWT Token */
const generateToken = (email: string, type: "authn-claim" | "authn", expiresIn: StringValue): string => {
  const payload = { email, type };
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Authentication Handlers
 */
export async function create(req: IncomingMessage, res: ServerResponse) {
  anyBody(req, (err, body) => {
    if (err !== null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid body" }));
      return;
    }
    const email = (body as Record<string, string>)["email"];
    if (!email) {
      // reply.status(400).send({ error: "Email is required" });
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Email is required" }));
      return;
    }

    const authnClaimToken: string = generateToken(email, "authn-claim", "10m");
    const magicLink: string = `http://localhost:3000/authentication/${authnClaimToken}`;

    console.log(`Magic link for ${email}: ${magicLink}`);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Magic link sent to email." }));
  });
}

type JwtDecodeResult<T> =
  | { type: 'Valid'; value: T }
  | { type: 'Expired'; value: T }
  | { type: 'Error'; error: unknown };

export function verifyJwt<T = any>(token: string, secret: string): JwtDecodeResult<T> {
  try {
    const payload = jwt.verify(token, secret) as T;
    return { type: 'Valid', value: payload };
  } catch (err: any) {
    if (err instanceof TokenExpiredError) {
      const payload = jwt.decode(token) as T;
      return { type: 'Expired', value: payload };
    }
    return { type: 'Error', error: err };
  }
}

export async function read(req: IncomingMessage & TokenPathParam, res: ServerResponse) {
  const encodedPathToken: string | undefined = req.params["token"];
  if (encodedPathToken != null) {
    const pathToken: JwtDecodeResult<DecodedJWT> = verifyJwt(encodedPathToken, JWT_SECRET);
    switch (pathToken.type) {
      case 'Valid': {
        const decoded = pathToken.value;
        if (decoded.type != "authn-claim") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "unexpected token" }));
          return;
        }
        const sessionToken: string = generateToken(decoded.email, "authn", "7d");
        const cookieValue = cookie.serialize(COOKIE_NAME, sessionToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          secure: true,
        });
        res.setHeader('Set-Cookie', cookieValue);
        // if (typeof redirectTo === "string" && redirectTo !== "") {
        const redirectTo = "/";
        res.statusCode = 302;
        res.setHeader('Location', redirectTo);
        res.end();
        return;
        //}
        // res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify({ token: sessionToken }));
        // return;
      }
      case 'Expired': {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "magiclink is expired" }));
        return;
      }
      case 'Error':
      default: {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "magiclink is invalid" }));
        return;
      }
    }
  }


  const authHeader: string | undefined = req.headers['authorization'];
  const encodedHeaderToken: string | undefined = authHeader?.replace(/^Bearer\s+/, '');
  const headerToken: JwtDecodeResult<DecodedJWT> | undefined = encodedHeaderToken == null ? undefined : verifyJwt(encodedHeaderToken, JWT_SECRET);

  const cookies = cookie.parse(req.headers.cookie || '');
  const encodedCookieToken: string | undefined = cookies[COOKIE_NAME];
  const cookieToken: JwtDecodeResult<DecodedJWT> | undefined = encodedCookieToken == null ? undefined : verifyJwt(encodedCookieToken, JWT_SECRET);


  if (headerToken != null && cookieToken != null && pathToken != null) {

  }



  if (token == null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "token is required" }));
      return;
  }

  // const { query } = parseUrl(req.url ?? '');
  // const queryParams = parseQuery(query ?? '');
  // const redirectTo: string | string[] | undefined = queryParams["redirect-to"];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as DecodedJWT;

    switch (decoded.type) {
      case "authn": {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(decoded));
        return;
      }
      case "authn-claim": {
        const sessionToken: string = generateToken(decoded.email, "authn", "7d");
        const cookieValue = cookie.serialize(COOKIE_NAME, sessionToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          secure: true,
        });
        res.setHeader('Set-Cookie', cookieValue);
        // if (typeof redirectTo === "string" && redirectTo !== "") {
        //   res.statusCode = 302;
        //   res.setHeader('Location', redirectTo);
        //   res.end();
        //   return;
        // }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ token: sessionToken }));
      }
      default: throw new Error("Unexpected JWT value.");
    }
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid or expired token" }));
  }
}


export async function update(req: IncomingMessage & TokenPathParam, res: ServerResponse) {
  const token: string | undefined = req.params["token"];
  if (token == null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "token is required" }));
      return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as DecodedJWT;

    if (decoded.type !== "authn") {
      // reply.status(401).send({ error: "Not authenticated" });
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not authenticated" }));
      return;
    }

    const newToken: string = generateToken(decoded.email, "authn", "7d");

    const cookies = cookie.parse(req.headers.cookie || '');
    const cookieValue = cookie.serialize(COOKIE_NAME, newToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: true,
    });
    res.setHeader('Set-Cookie', cookieValue);
    // reply.send({ success: true, message: "Session refreshed.", token: newToken } as AuthenticationUpdateResponse);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Session refreshed.", token: newToken }));
  } catch (err) {
    // reply.status(401).send({ error: "Session expired, please log in again." });
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Session expired, please log in again." }));
  }
}

export async function del(req: IncomingMessage & TokenPathParam, res: ServerResponse) {
  const token: string | undefined = req.params["token"];
  if (token == null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "token is required" }));
      return;
  }

  const cookieValue = cookie.serialize('session', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: true,
    expires: new Date(0),
  });
  res.setHeader('Set-Cookie', cookieValue);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({}));
}
