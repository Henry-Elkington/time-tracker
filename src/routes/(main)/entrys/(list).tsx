import { db } from "~/backend/db";
import { z } from "zod";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { RouteDataArgs, useRouteData } from "solid-start";
import { For, Show, type VoidComponent } from "solid-js";
import { FormInputs } from "~/frontend/FormInputs";
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

const people = [
  { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
  { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
  { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
  { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
  { name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
];

// Page Component
const ListEntrys: VoidComponent = () => {
  const { timeEntrys } = useRouteData<typeof routeData>();
  const [CreateTimeEntryAction, CreateTimeEntry] = createServerAction$(createTimeEntryFn);

  return (
    <main class="container m-auto bg-white">
      <h1 class="p-5 text-center text-4xl">Time Entrys</h1>
      <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4">
        <CreateTimeEntry.Form class="flex flex-col gap-4 border p-4">
          <h2 class="text-2xl">New Time Entry</h2>
          <FormInputs
            inputs={[
              { label: "Name", props: { name: "name", type: "text", required: true } },
              { label: "Discription", props: { name: "discription", type: "text", required: true } },
              { label: "Start Time", props: { name: "startTimeLocal", type: "datetime-local", required: true } },
              { label: "End Time", props: { name: "endTimeLocal", type: "datetime-local", required: true } },
            ]}
            errors={CreateTimeEntryAction.error}
            pending={CreateTimeEntryAction.pending}
          />
        </CreateTimeEntry.Form>
        <table class="table-fixed divide-y divide-gray-300 whitespace-nowrap">
          <thead>
            <tr>
              <th scope="col" class="text-left text-sm font-semibold text-gray-900 sm:pl-0">
                Name
              </th>
              <th scope="col" class="text-left text-sm font-semibold text-gray-900">
                Discription
              </th>
              <th scope="col" class="text-left text-sm font-semibold text-gray-900">
                Duration
              </th>
              <th scope="col" class="text-left text-sm font-semibold text-gray-900" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <For each={timeEntrys()}>
              {(entry) => {
                const [DeleteTimeEntryAction, DeleteTimeEntry] = createServerAction$(deleteTimeEntryFn);

                return (
                  <tr class="text-gray-500">
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
    </main>
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
