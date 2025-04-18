# Chapter: Cookies, User Sessions & JSON Web Tokens

Eventually you'll need to track who the user is across requests—especially after they’ve logged in. This is where cookies and user sessions come in.

## 🍪 What Are Cookies?

Cookies are small pieces of data that your server can ask the browser to store. They are sent along with every subsequent request to the same domain.

### Example Use:

- Storing session IDs.
- Remembering user preferences.
- Keeping users logged in.

### How Cookies Work:

1. Server sends a Set-Cookie header: `Set-Cookie: sessionId=abc123; HttpOnly; Secure; Path=/; Max-Age=3600`
2. The browser saves the cookie.
3. On the next request, the browser sends it back: `Cookie: session=abc123`

## What Are User Sessions?

A user session is a way to track a user across multiple requests, typically by assigning them a unique session ID that’s stored in a cookie.

### Example Workflow:

1. User logs in.
2. Server verifies credentials and generates a session id.
3. Server stores the session ID along with some user data (like their user ID).
4. The session id is sent to the browser as a cookie.
5. On subsequent requests, the server uses that ID to look up who the user is.

## 🔐 What Are JSON Web Tokens (JWTs)?

JWTs are a modern alternative to sessions. Instead of storing session data on the server, the token itself contains the data—and it’s cryptologically signed to prevent tampering.

### JWT Structure:

A JWT has 3 parts, separated by dots (.):

HEADER.PAYLOAD.SIGNATURE

Example:

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

#### Breakdown:

- Header: Algorithm and token type
- Payload: Data like userId, role, exp (expiration)
- Signature: Verifies that the token wasn’t tampered with

### Example Use:

1. User logs in.
2. Server creates a JWT containing their user ID.
3. JWT is sent to the browser (like in a cookie).
4. On future requests, the token is sent back (often in the Authorization header).
5. Server verifies the token and extracts the user info.

### Why JWTs Are Useful:

- Stateless: No need to store sessions on the server.
- Portable: Can be used across APIs and services.
- Built-in expiration: Can include exp to auto-expire tokens.
