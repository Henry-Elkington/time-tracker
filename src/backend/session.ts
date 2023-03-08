import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";
import { db } from "~/backend";

type SignupForm = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type LoginForm = {
  email: string;
  password: string;
};

export async function register({ email, firstName, lastName, password }: SignupForm) {
  return db.user.create({
    data: {
      email,
      firstName,
      lastName,
      password,
    },
  });
}

export async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;
  const isCorrectPassword = password === user.password;
  if (!isCorrectPassword) return null;
  return user;
}

// const sessionSecret = import.meta.env.SESSION_SECRET;
const sessionSecret = process.env.SESSION_SECRET;

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: true,
    secrets: ["hello"],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({ where: { id: String(userId) } });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// import { redirect } from "solid-start/server";
// import { createCookieSessionStorage } from "solid-start/session";

// // const sessionSecret = import.meta.env.SESSION_SECRET;
// const storage = createCookieSessionStorage({
//   cookie: {
//     name: "session",
//     // secure doesn't work on localhost for Safari
//     // https://web.dev/when-to-use-local-https/
//     secure: false, // secure: process.env.NODE_ENV === "production",
//     secrets: ["hello"], // secrets: [process.env.SESSION_SECRET],
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 30, // 30 days
//     httpOnly: true,
//   },
// });
// export function getSessionCookie(request: Request) {
//   return storage.getSession(request.headers.get("Cookie"));
// }

// export async function getCreateSessionHeaders(userId: string) {
//   const session = await storage.getSession();
//   session.set("userId", userId);
//   return {
//     "Set-Cookie": await storage.commitSession(session),
//   };
// }
// export async function getDeleteSessionHeaders() {
//   const session = await storage.getSession();
//   // const session = await getSession(request);
//   return {
//     "Set-Cookie": await storage.destroySession(session),
//   };
// }

// export async function getSession(request: Request, redirectInfo?: { whenEmpty: boolean; url: string }) {
//   const session = await getSessionCookie(request);
//   const userId: string | undefined = session.get("userId");

//   if (!redirectInfo) return userId;

//   if (typeof userId === "string" && userId.length > 0) {
//     if (redirectInfo.whenEmpty) {
//       throw redirect(redirectInfo.url);
//     } else {
//       return userId;
//     }
//   } else {
//     if (redirectInfo.whenEmpty) {
//       throw redirect(redirectInfo.url);
//     } else {
//       return userId;
//     }
//   }
// }
