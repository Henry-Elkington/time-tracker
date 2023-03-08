// import { PrismaClient } from "@prisma/client";

// declare global {
//   // eslint-disable-next-line no-var
//   var db: PrismaClient | undefined;
// }

// export const db =
//   global.db ||
//   new PrismaClient({
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   global.db = db;
// }

import { PrismaClient } from "@prisma/client";
import { isServer } from "solid-js/web";

let prismaClient = undefined as unknown as PrismaClient;

if (isServer) {
  prismaClient = new PrismaClient();
}

export const db = prismaClient;
