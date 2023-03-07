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

const Settings: VoidComponent = () => {
  const { user } = useRouteData<routeDataProfileType>();
  const [CreateTimeEntryAction, CreateTimeEntry] = createServerAction$(updateProfileFn);

  return (
    <div>
      <h1 class="p-3 py-5 text-4xl">Settings</h1>
      <hr class="border-neutral-300" />
      <p>{user()?.email}</p>
      <p>{user()?.firstName}</p>
      <p>{user()?.lastName}</p>
      <p>{user()?.password}</p>
    </div>
  );
};

export default Settings;

/* Actions
  ============================================ */

async function updateProfileFn(formData: FormData) {
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
