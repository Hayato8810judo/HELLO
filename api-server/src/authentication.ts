import anyBody from 'body/any';
import { IncomingMessage, ServerResponse } from "http";
import jwt, { TokenExpiredError, SignOptions } from "jsonwebtoken";
import { default as ms, type StringValue} from "ms";
import { getConfig } from "./config"

const { APPLICATION_AUTH_CLAIM_PREFIX, JWT_CLAIM_SECRET, JWT_SESSION_SECRET } = getConfig();

export function getLoggedInUser(encodedToken: string): string | null {
  try {
    const claim = jwt.verify(encodedToken, JWT_SESSION_SECRET)
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

/**
 * Handles a POST request to initiate an authentication flow by creating a short-lived claim token.
 *
 * The request body must include an `email` field. If valid, a JWT is created and printed to the console (if not in production).
 * The token is encoded in a magic link that can be sent to the user for passwordless login.
 *
 * @param req - Incoming HTTP request, expected to contain a JSON body with an `email` field.
 * @param res - HTTP response, used to return a success or error status.
 *
 * @returns 200 OK with an empty body on success, or 400 Bad Request with an error message if the email is missing or malformed.
 */
export function createClaim(req: IncomingMessage, res: ServerResponse) {
  anyBody(req, function(err: Error | null, body: unknown) {
    if (err !== null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid body" }));
      return;
    }

    const email: string | null = body != null && typeof body === "object" && "email" in body
      ? (typeof body.email === "string" ? body.email : null)
      : null;

    if (email == null || email === "") {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "email is required" }));
      return;
    }

    const authnClaimToken: string = generateToken(email, "10m", JWT_CLAIM_SECRET);
    const magicLink: string = APPLICATION_AUTH_CLAIM_PREFIX + authnClaimToken;

    if (process.env.NODE_ENV !== "production") {
      console.log(`Magic link for ${email}: ${magicLink}`);
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({}));
  });
}

/**
 * Exchanges a claim token for a session token (Bearer token).
 *
 * The request body must include a valid `token` field (the claim). If verified, a long-lived session JWT is issued.
 * The response includes the token, token type, expiration, and user email.
 *
 * @param req - Incoming HTTP request, expected to contain a JSON body with a `token` field.
 * @param res - HTTP response, used to return the session token or an error message.
 *
 * @returns 200 OK with a JSON payload containing the session token, token type, expiration time in milliseconds, and user info.
 *          400 Bad Request or 500 Internal Server Error on failure.
 */
export function createSession(req: IncomingMessage, res: ServerResponse) {
  anyBody(req, function(err: Error | null, body: unknown) {
    if (err !== null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid body" }));
      return;
    }


    const token: string | null = body != null && typeof body === "object" && "token" in body
      ? (typeof body.token === "string" ? body.token : null)
      : null;

    if (token == null || token === "") {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "token is required" }));
      return;
    }

    try {
      const claim = jwt.verify(token, JWT_CLAIM_SECRET)
      if (typeof claim === "string") throw new Error("claim should be an object");
      if (claim.email == null) throw new Error("email expected in claim token");

      const expirationString = "7d";
      const sessionToken: string = generateToken(claim.email, expirationString, JWT_SESSION_SECRET);
      const response = {
        "access_token": sessionToken,
        "token_type": "Bearer",
        "exp": ms(expirationString),
        "user": { "email": claim.email },
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
      return;
    } catch (err: unknown) {
      if (err instanceof TokenExpiredError) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "authentication claim could not be decoded" }));
        return;
      }
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "an unexpected error occurred" }));
    }
  });
}

/**
 * Reads and validates a session token provided as a URL parameter.
 *
 * The token is verified and its contents (email and expiration) are returned in the response.
 * This is useful for debugging or introspecting session tokens client-side.
 *
 * @param req - Incoming HTTP request with a `params` object containing a `token` field.
 * @param res - HTTP response, used to return token contents or an error.
 *
 * @returns 200 OK with a JSON payload containing the access token, token type, expiration, and user email.
 *          500 Internal Server Error if the token is missing or invalid.
 */
export function readSession(req: IncomingMessage & { params: {"token": string} }, res: ServerResponse) {
  // router adds params to IncomingMessage
  const token = req.params.token;
  if (typeof token != "string") {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "token is required" }));
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SESSION_SECRET);
    if (typeof decoded === "string") throw new Error("decoded token should be an object");
    if (decoded.email == null) throw new Error("email expected in decoded token");
    if (decoded.exp == null) throw new Error("exp expected in decoded token");

    const response = {
      "access_token": token,
      "token_type": "Bearer",
      "exp": decoded.exp,
      "user": { "email": decoded.email },
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (e) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "an unexpected error occurred" }));
  }
}
