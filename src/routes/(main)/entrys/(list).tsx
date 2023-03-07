import { db } from "~/backend/db";
import { z } from "zod";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { RouteDataArgs, useRouteData } from "solid-start";
import { For, Show, type VoidComponent } from "solid-js";
import { CreateFields } from "~/frontend/CreateFields";
import { validateFields } from "~/backend/utils";

/* Data Fetching
  ============================================ */

export const routeData = ({}: RouteDataArgs) => {
  const timeEntrys = createServerData$(
    async () => {
      const entrys = await db.timeEntry.findMany();
      return entrys.map((entry) => ({
        id: entry.id,
        name: entry.name,
        discription: entry.discription,
        lenth: entry.endTime.getTime() - entry.startTime.getTime(),
      }));
    },
    { key: ["timeEntrys"] }
  );
  return { timeEntrys: timeEntrys };
};

/* Frontend
  ============================================ */

// Page Component
const ListEntrys: VoidComponent = () => {
  const { timeEntrys } = useRouteData<typeof routeData>();
  const [CreateTimeEntryAction, CreateTimeEntry] = createServerAction$(createTimeEntryFn);

  return (
    <div>
      <h1 class="p-5 text-center text-4xl">Time Entrys</h1>
      <div class="mx-auto flex flex-col gap-4">
        <CreateTimeEntry.Form class="flex flex-col gap-4 border p-4">
          <h2 class="text-2xl">New Time Entry</h2>
          <CreateFields
            inputs={[
              { label: "Name", props: { name: "name", type: "text" } },
              { label: "Discription", props: { name: "discription", type: "text" } },
              { label: "Start Time", props: { name: "startTimeLocal", type: "datetime-local" } },
              { label: "End Time", props: { name: "endTimeLocal", type: "datetime-local" } },
            ]}
            errors={CreateTimeEntryAction.error}
            pending={CreateTimeEntryAction.pending}
          />
        </CreateTimeEntry.Form>
        <table class="table-fixed divide-y divide-neutral-300 whitespace-nowrap">
          <thead>
            <tr>
              <th scope="col" class="text-left text-sm font-semibold text-neutral-900 sm:pl-0">
                Name
              </th>
              <th scope="col" class="text-left text-sm font-semibold text-neutral-900">
                Discription
              </th>
              <th scope="col" class="text-left text-sm font-semibold text-neutral-900">
                Duration
              </th>
              <th scope="col" class="text-left text-sm font-semibold text-neutral-900" />
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-300">
            <For each={timeEntrys()}>
              {(entry) => {
                const [DeleteTimeEntryAction, DeleteTimeEntry] = createServerAction$(deleteTimeEntryFn);

                return (
                  <tr class="text-neutral-500">
                    <td class="">{entry.name}</td>
                    <td class="">{entry.discription}</td>
                    <td class="">{entry.lenth / 1000 / 60} minutes</td>
                    <td class="text-right">
                      <DeleteTimeEntry.Form>
                        <input name="id" type="hidden" value={entry.id} />
                        <button class="text-blue-600 hover:text-blue-900">
                          <Show when={DeleteTimeEntryAction.pending} fallback="Delete">
                            Loading...
                          </Show>
                        </button>
                      </DeleteTimeEntry.Form>
                    </td>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListEntrys;

/* Actions
  ============================================ */

async function createTimeEntryFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      name: z.string().min(5),
      discription: z.string(),
      startTimeLocal: z.coerce.date(),
      endTimeLocal: z.coerce.date(),
    })
  );

  await db.timeEntry.create({
    data: {
      name: data.name,
      discription: data.discription,
      startTime: data.startTimeLocal,
      endTime: data.endTimeLocal,
    },
  });

  return redirect("/entrys");
}
async function deleteTimeEntryFn(formData: FormData) {
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
