import type { Prisma } from "@prisma/client";
import { db } from "~/backend/db";

// const useUpdate = () => {
//   return {};
// };

// const useDelete = () => {
//   return {};
// };

// async function createTimeEntryFn(formData: FormData) {
//   await new Promise((resolve, reject) => setTimeout(resolve, 1000));

//   try {
//     const name = getStringFromForm(formData, "name");
//     const discription = getStringFromForm(formData, "discription");
//     const startTime = new Date(getStringFromForm(formData, "startTime"));
//     const endTime = new Date(getStringFromForm(formData, "endTime"));

//     await db.timeEntry.create({
//       data: {
//         name: name,
//         discription: discription,
//         startTime: startTime,
//         endTime: endTime,
//       },
//     });
//     return redirect("/");
//   } catch {
//     return redirect("/");
//   }
// }
// async function updateTimeEntryFn(formData: FormData) {
//   await new Promise((resolve, reject) => setTimeout(resolve, 1000));

//   try {
//     const id = getStringFromForm(formData, "id");
//     const name = getStringFromForm(formData, "name");
//     const discription = getStringFromForm(formData, "discription");
//     const startTime = new Date(getStringFromForm(formData, "startTime"));
//     const endTime = new Date(getStringFromForm(formData, "endTime"));

//     await db.timeEntry.update({
//       where: {
//         id: id,
//       },
//       data: {
//         name: name,
//         discription: discription,
//         startTime: startTime,
//         endTime: endTime,
//       },
//     });
//     return redirect("/");
//   } catch {
//     return redirect("/");
//   }
// }
// async function deleteTimeEntryFn(formData: FormData) {
//   await new Promise((resolve, reject) => setTimeout(resolve, 1000));

//   try {
//     const id = getStringFromForm(formData, "id");

//     await db.timeEntry.delete({
//       where: {
//         id: id,
//       },
//     });
//     return redirect("/");
//   } catch {
//     return redirect("/");
//   }
// }
