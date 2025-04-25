import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { json, type LinksFunction, type LoaderFunctionArgs  } from "@remix-run/node";
import "./tailwind.css";

import { getConfig, type ApplicationConfig } from "~/config";
import { bearerTokenCookie } from "~/cookies";
import Footer from "~/components/footer";
import Header from "~/components/header";

const { API_BASE_URL } = getConfig();

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  const token = (await bearerTokenCookie.parse(cookie)) ?? null;

  const session = token == null
    ? null
    : await (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/authn-session/${token}`);
          return res.ok ? await res.json() : null;
        } catch (_) {
          return null;
        }
      })();
  const user = session != null && typeof session === "object" && "user" in session
    ? session.user
    : null;
  const config = getConfig();

  return json({ user, config });
}

export function Layout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-neutral-900 text-neutral-200 relative">
          <Header user={user}/>
          <Outlet/>
          <ScrollRestoration />
          <Scripts />
          <Footer/>
        </div>
      </body>
    </html>
  );
}

export default function App() {
  const { config } = useLoaderData<typeof loader>();
  return <Outlet context={{ config }} />;
}
