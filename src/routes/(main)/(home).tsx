import { db } from "~/backend/db";
import { z } from "zod";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { RouteDataArgs, useRouteData } from "solid-start";
import { For, Show, type VoidComponent } from "solid-js";
import { CreateFields } from "~/frontend/CreateFields";
import { validateFields } from "~/backend/utils";
import { routeDataMainType } from "../(main)";

/* Data Fetching
  ============================================ */

export type routeDataProfileType = typeof routeData;
export const routeData = ({ data }: RouteDataArgs<routeDataMainType>) => {
  return { user: data };
};

/* Frontend
  ============================================ */

// Page Component
const Profile: VoidComponent = () => {
  const { user } = useRouteData<routeDataProfileType>();
  const [CreateTimeEntryAction, CreateTimeEntry] = createServerAction$(updateProfileFn);

  return (
    <main class="container m-auto bg-white md:px-10">
      <h1 class="p-5 text-center text-4xl">Home</h1>
    </main>
  );
};

export default Profile;

/* Actions
  ============================================ */

async function updateProfileFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
    })
  );

  const deletedTimeEntry = await db.timeEntry.delete({
    where: {
      id: data.id,
    },
  });

  return redirect("/entrys");
}
