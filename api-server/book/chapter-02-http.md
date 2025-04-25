# Understanding HTTP and Servers

HTTP stands for Hypertext Transfer Protocol, and it's the communication protocol used for websites (the "http" in http://www.google.com). A protocol is just a fancy word for "a communication contract" that defines how computers exchange information over the internet.

Learning HTTP is an integral part of building software that interacts with the internet, but you're probably more familiar with it than you think. If you've ever visited a webpage and seen a 404 error (Not Found) or a 500 error (Server Error), you've already encountered HTTP responses.

HTTP operates using a set of status codes and request types. The most common request types include:

- GET – Used to retrieve data (e.g., loading a webpage)
- POST – Used to send data to a server (e.g., submitting a form)
- PUT – Used to update data on the server
- DELETE – Used to remove data from the server

The most important thing to know right now is that when you type a URL into your browser, you're making a GET request. When the request is successful, the server responds with a status code 200 (OK) and returns the requested data (e.g., HTML, text, or JSON).

## Simple TypeScript HTTP Server

```ts
import { createServer, IncomingMessage, ServerResponse } from "http";

function handler(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, world!`);
}

const server = createServer(handler);

// Start the server
server.listen(3000, function() {
  console.log(`Server running at http://localhost:3000/`);
});
```

### Breakdown

```ts
import { createServer, IncomingMessage, ServerResponse } from "http";
```

Importing is how we get stuff from other files to use. Node comes with some tools for us to build http servers that we need to import.

- `createServer`: A function that creates an HTTP server.
- `IncomingMessage`: Represents the request sent by a client.
- `ServerResponse`: Represents the response sent back to the client.

```ts
function handler(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, world!`);
}
```


- We define a function handler that will process all incoming requests.
- `res.writeHead(200, { "Content-Type": "text/plain" })`: Sets the HTTP status code to 200 (OK) and specifies that the response is plain text.
- `res.end("Hello, world!")`: Ends the response and sends "Hello, world!" to the client.

```ts
const server = createServer(handler);
```

We create an HTTP server using createServer(handler), which tells Node.js to run the handler function for every request.

```ts
server.listen(3000, function() {
  console.log(`Server running at http://localhost:3000/`);
});
```

Passing a function to another function as the last argument is a common pattern and called a "callback." We do this in order to say "once you're done, do this." In this case, start listening for requests and when you're done setting up, let us print to the terminal that we're ready to go.
