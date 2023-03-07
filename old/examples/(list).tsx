import { db } from "~/backend/db";
import { z } from "zod";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { RouteDataArgs, useRouteData } from "solid-start";
import { For, type VoidComponent } from "solid-js";
import { FormInputs } from "~/frontend/FormInputs";
import { validateFields } from "~/backend/utils";

/* Data Fetching
  ============================================ */

export const routeData = ({}: RouteDataArgs) => {
  const timeEntrys = createServerData$(
    () => {
      return db.timeEntry.findMany({
        select: {
          id: true,
          name: true,
          discription: true,
          startTimeLocal: true,
          endTimeLocal: true,
        },
      });
    },
    { key: ["timeEntrys"] }
  );
  return { timeEntrys: timeEntrys };
};

/* Frontend
  ============================================ */

// Page Component
const TimeEntry: VoidComponent = () => {
  const { timeEntrys } = useRouteData<typeof routeData>();
  const [CreateTimeEntryAction, CreateTimeEntry] = createServerAction$(createTimeEntryFn);

  return (
    <main class="container m-auto bg-white">
      <h1 class="p-5 text-center text-4xl">Time Entrys</h1>
      <div class="mx-auto flex max-w-2xl flex-col gap-4 px-4">
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
        <For each={timeEntrys()}>
          {(entry) => {
            const [UpdateTimeEntryAction, UpdateTimeEntry] = createServerAction$(updateTimeEntryFn);
            const [DeleteTimeEntryAction, DeleteTimeEntry] = createServerAction$(deleteTimeEntryFn);

            return (
              <div class="flex flex-col gap-0">
                <UpdateTimeEntry.Form class="flex flex-col gap-4 border p-4">
                  <h2 class="text-2xl">Update Time Entry</h2>
                  <FormInputs
                    inputs={[
                      { props: { name: "id", type: "hidden", value: entry.id } },
                      { label: "Name", props: { name: "name", type: "text", value: entry.name, required: true } },
                      {
                        label: "Discription",
                        props: { name: "discription", type: "text", value: entry.discription, required: true },
                      },
                      {
                        label: "Start Time",
                        props: {
                          name: "startTimeLocal",
                          value: entry.startTimeLocal,
                          type: "datetime-local",
                          required: true,
                        },
                      },
                      {
                        label: "End Time",
                        props: {
                          name: "endTimeLocal",
                          type: "datetime-local",
                          value: entry.endTimeLocal,
                          required: true,
                        },
                      },
                    ]}
                    submitLable="Update"
                    errors={UpdateTimeEntryAction.error}
                    pending={UpdateTimeEntryAction.pending}
                  />
                </UpdateTimeEntry.Form>
                <DeleteTimeEntry.Form>
                  <FormInputs
                    inputs={[{ props: { name: "id", value: entry.id, type: "hidden" } }]}
                    submitLable="Delete"
                    errors={DeleteTimeEntryAction.error}
                    pending={DeleteTimeEntryAction.pending}
                  />
                </DeleteTimeEntry.Form>
              </div>
            );
          }}
        </For>
      </div>
    </main>
  );
};

export default TimeEntry;

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
      startTimeLocal: formData.get("startTime") as string,
      endTimeLocal: formData.get("endTime") as string,
      startTime: data.startTimeLocal,
      endTime: data.endTimeLocal,
    },
  });

  return redirect("/");
}
async function updateTimeEntryFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
      name: z.string().min(5),
      discription: z.string(),
      startTimeLocal: z.coerce.date(),
      endTimeLocal: z.coerce.date(),
    })
  );

  const updatedTimeEntry = await db.timeEntry.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      discription: data.discription,
      startTimeLocal: formData.get("startTimeLocal") as string,
      endTimeLocal: formData.get("endTimeLocal") as string,
      startTime: data.startTimeLocal,
      endTime: data.endTimeLocal,
    },
  });

  return redirect("/");
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

  return redirect("/");
}
