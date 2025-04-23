import {
  json,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { getConfig } from "~/config";
import { bearerTokenCookie } from "~/cookies";

export async function action({ request }: ActionFunctionArgs) {
  const { API_BASE_URL } = getConfig();
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  // If there's a token in the URL, redeem it
  if (token) {
    const sessionRes = await fetch(`${API_BASE_URL}/authn-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!sessionRes.ok) {
      return redirect("/login?error=invalid-token");
    }

    const data = await sessionRes.json();
    const bearerToken = data.token;

    if (!bearerToken) {
      return redirect("/login?error=missing-token");
    }

    const cookie = await bearerTokenCookie.serialize(bearerToken);
    const headers = { "Set-Cookie": cookie };
    return redirect("/", { headers });
  }

  // Normal email submission flow to request login link
  const formData = await request.formData();
  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    return json({ error: "Please provide a valid email address" }, { status: 400 });
  }

  const claimRes = await fetch(`${API_BASE_URL}/authn-claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!claimRes.ok) {
    return json({ error: "Invalid login request" }, { status: claimRes.status });
  }

  return json(null, { status: 200 });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isComplete = !isSubmitting && actionData === null;
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br">
      <div className="bg-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Log in to your account
        </h1>
        {error && (
          <p className="text-red-500 text-center">
            ❌ {error.replace(/-/g, " ")}
          </p>
        )}
        {isComplete ? (
          <p className="text-green-600 text-center">
            ✅ Check your email to continue.
          </p>
        ) : (
          <Form method="post" className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
              >
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              {isSubmitting ? "Sending…" : "Log In"}
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
