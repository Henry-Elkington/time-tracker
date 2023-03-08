import { db } from "~/backend";
import { z } from "zod";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { For, Show, type VoidComponent } from "solid-js";
import { validateFields } from "~/backend/utils";
import { InputComponent, Page, Button, Card, ErrorLabel } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = () => {
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

  const CreateTimeEntryForm = () => (
    <CreateTimeEntry.Form class="flex w-full flex-col gap-3 lg:w-80">
      <div class="flex flex-col gap-3">
        <InputComponent
          name="name"
          type="text"
          errorMessage={CreateTimeEntryAction.error?.fieldErrors?.name}
          invalid={CreateTimeEntryAction.error?.fieldErrors?.startTimeLocal}
          lableText="Name:"
          class="w-full"
        />
        <InputComponent
          name="discription"
          type="text"
          errorMessage={CreateTimeEntryAction.error?.fieldErrors?.discription}
          invalid={CreateTimeEntryAction.error?.fieldErrors?.startTimeLocal}
          lableText="Discription:"
          class="w-full"
        />
        <InputComponent
          name="startTimeLocal"
          type="datetime-local"
          errorMessage={CreateTimeEntryAction.error?.fieldErrors?.startTimeLocal}
          invalid={CreateTimeEntryAction.error?.fieldErrors?.startTimeLocal}
          lableText="Start Time:"
          class="w-full"
        />
        <InputComponent
          name="endTimeLocal"
          type="datetime-local"
          errorMessage={CreateTimeEntryAction.error?.fieldErrors?.endTimeLocal}
          invalid={CreateTimeEntryAction.error?.fieldErrors?.endTimeLocal}
          lableText="End Time:"
          class="w-full"
        />
      </div>
      <div class="flex flex-col pt-2">
        <Button disabled={CreateTimeEntryAction.pending} loading={CreateTimeEntryAction.pending}>
          Create
        </Button>
        <ErrorLabel>{CreateTimeEntryAction.error?.message}</ErrorLabel>
      </div>
    </CreateTimeEntry.Form>
  );

  const TimeEntryList = () => (
    <table class="w-full grow table-fixed divide-y divide-neutral-300 whitespace-nowrap">
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
  );

  return (
    <Page title="Time Entrys">
      <div class="flex flex-col items-start gap-10 lg:flex-row lg:items-stretch">
        <CreateTimeEntryForm />
        <TimeEntryList />
      </div>
    </Page>
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
