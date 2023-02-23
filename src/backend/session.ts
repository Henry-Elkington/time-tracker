import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";

// const sessionSecret = import.meta.env.SESSION_SECRET;
const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: false, // secure: process.env.NODE_ENV === "production",
    secrets: ["hello"], // secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function getCreateSessionHeaders(
  request: Request,
  userId: string
) {
  const session = await getSession(request);
  session.set("userId", userId);
  return {
    "Set-Cookie": await storage.commitSession(session),
  };
}
export async function getDeleteSessionHeaders(request: Request) {
  const session = await storage.getSession();
  // const session = await getSession(request);
  return {
    "Set-Cookie": await storage.destroySession(session),
  };
}

export function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getIdFromSession(request: Request) {
  const session = await getSession(request);
  const userId: string | undefined = session.get("userId");
  return userId;
}
export async function getIdFromSessionOrRedirect(request: Request) {
  const session = await getSession(request);
  const userId: string | null = session.get("userId");
  if (!userId) {
    throw redirect("/login");
  }
  return userId;
}
