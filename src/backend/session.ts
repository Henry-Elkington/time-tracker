import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";

const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET as string],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function createSession(userId: string) {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// redirectTo: string = new URL(request.url).pathname
// const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
export async function getSession(request: Request, redirectIfExists?: boolean): Promise<string> {
  const cookie = request.headers.get("Cookie") ?? "";
  const session = await storage.getSession(cookie);
  const userId = session.get("userId");

  if (!redirectIfExists) {
    if (!userId || typeof userId !== "string") {
      throw redirect("/login");
    }
  } else {
    if (userId && typeof userId === "string") {
      throw redirect("/");
    }
  }

  return userId;
}

export async function deleteSession(request: Request) {
  const cookie = request.headers.get("Cookie") ?? "";
  const session = await storage.getSession(cookie);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
