// --- Backend --- //
// --------------- //
import { db } from "~/backend/db";
import { getStringFromForm } from "~/backend/utils/form";

// Loading Functions
const getTimeEntrysFn = async () => {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  return await db.timeEntry.findMany();
};

// Action Functions
async function createTimeEntryFn(formData: FormData) {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  try {
    const name = getStringFromForm(formData, "name");
    const discription = getStringFromForm(formData, "discription");
    const startTime = new Date(getStringFromForm(formData, "startTime"));
    const endTime = new Date(getStringFromForm(formData, "endTime"));

    await db.timeEntry.create({
      data: {
        name: name,
        discription: discription,
        startTime: startTime,
        endTime: endTime,
      },
    });
    return redirect("/");
  } catch {
    return redirect("/");
  }
}
async function updateTimeEntryFn(formData: FormData) {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  try {
    const id = getStringFromForm(formData, "id");
    const name = getStringFromForm(formData, "name");
    const discription = getStringFromForm(formData, "discription");
    const startTime = new Date(getStringFromForm(formData, "startTime"));
    const endTime = new Date(getStringFromForm(formData, "endTime"));

    await db.timeEntry.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        discription: discription,
        startTime: startTime,
        endTime: endTime,
      },
    });
    return redirect("/");
  } catch {
    return redirect("/");
  }
}
async function deleteTimeEntryFn(formData: FormData) {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  try {
    const id = getStringFromForm(formData, "id");

    await db.timeEntry.delete({
      where: {
        id: id,
      },
    });
    return redirect("/");
  } catch {
    return redirect("/");
  }
}

// --- Frontend --- //
// ---------------- //
import { createServerAction$, createServerData$, createServerMultiAction$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type Component, For, Show, type VoidComponent } from "solid-js";
import type { TimeEntry } from "@prisma/client";
import { getLocalTimeFromStringOrObject, toLocalIsoStringForForm } from "~/utils/datetime";

// Data Fetching
export function routeData() {
  const timeEntrys = createServerData$(getTimeEntrysFn, { key: ["timeEntrys"] });
  return { timeEntrys: timeEntrys };
}

// Page Component
const Users: VoidComponent = () => {
  const { timeEntrys } = useRouteData<typeof routeData>();

  const [CreateTimeEntryAction, CreateTimeEntry] = createServerAction$(createTimeEntryFn);
  const CreateTimeEntryForm: Component = () => {
    return (
      <CreateTimeEntry.Form class="m-1 flex h-fit flex-col gap-2 border p-2">
        <label for="username">
          name:
          <input type="text" name="name" class="bg-gray-100" />
        </label>
        <label for="discription">
          discription:
          <input type="text" name="discription" class="bg-gray-100" />
        </label>
        <label for="startTime">
          startTime:
          <input type="datetime-local" name="startTime" class="bg-gray-100" />
        </label>
        <label for="endTime">
          endTime:
          <input type="datetime-local" name="endTime" class="bg-gray-100" />
        </label>
        <button type="submit" disabled={CreateTimeEntryAction.pending} class="bg-gray-100">
          <Show when={CreateTimeEntryAction.pending} fallback="Submit">
            Loading...
          </Show>
        </button>
      </CreateTimeEntry.Form>
    );
  };

  const [UpdateTimeEntryAction, UpdateTimeEntry] = createServerMultiAction$(updateTimeEntryFn);
  const UpdateTimeEntryForm: Component<{ timeEntry: TimeEntry }> = (props) => {
    return (
      <UpdateTimeEntry.Form class="mb-2 flex h-fit flex-col gap-2">
        <input type="hidden" name="id" value={props.timeEntry.id} />
        <label for="username">
          name:
          <input type="text" name="name" value={props.timeEntry.name} class="bg-gray-100" />
        </label>
        <label for="discription">
          discription:
          <input type="text" name="discription" value={props.timeEntry.discription} class="bg-gray-100" />
        </label>
        <label for="startTime">
          startTime:
          <input
            type="datetime-local"
            name="startTime"
            value={toLocalIsoStringForForm(getLocalTimeFromStringOrObject(props.timeEntry.startTime))}
            class="bg-gray-100"
          />
        </label>
        <label for="endTime">
          endTime:
          <input
            type="datetime-local"
            name="endTime"
            value={toLocalIsoStringForForm(getLocalTimeFromStringOrObject(props.timeEntry.endTime))}
            class="bg-gray-100"
          />
        </label>
        <button
          type="submit"
          disabled={UpdateTimeEntryAction.find((el) => el.input.get("id") === props.timeEntry.id) !== undefined}
          class="bg-gray-100"
        >
          <Show
            when={UpdateTimeEntryAction.find((el) => el.input.get("id") === props.timeEntry.id) !== undefined}
            fallback="Update"
          >
            Loading...
          </Show>
        </button>
      </UpdateTimeEntry.Form>
    );
  };

  const [DeleteTimeEntryAction, DeleteTimeEntry] = createServerMultiAction$(deleteTimeEntryFn);
  const DeleteTimeEntryForm: Component<{ timeEntry: TimeEntry }> = (props) => {
    return (
      <DeleteTimeEntry.Form class="flex h-fit flex-col gap-2">
        <input type="hidden" name="id" value={props.timeEntry.id} />
        <button
          type="submit"
          disabled={DeleteTimeEntryAction.find((el) => el.input.get("id") === props.timeEntry.id) !== undefined}
          class="bg-red-100 px-2"
        >
          <Show
            when={DeleteTimeEntryAction.find((el) => el.input.get("id") === props.timeEntry.id) !== undefined}
            fallback="Delete"
          >
            Loading...
          </Show>
        </button>
      </DeleteTimeEntry.Form>
    );
  };

  return (
    <main class="container m-auto bg-white">
      <h1 class="p-5 text-center text-4xl">Time Tracker</h1>
      <div class="flex">
        <div class="flex-1">
          <CreateTimeEntryForm />
        </div>
        <div class="flex-1">
          <For each={timeEntrys()}>
            {(timeEntry) => (
              <div class="m-1 border p-2">
                <UpdateTimeEntryForm timeEntry={timeEntry} />
                <DeleteTimeEntryForm timeEntry={timeEntry} />
              </div>
            )}
          </For>
        </div>
      </div>
    </main>
  );
};

export default Users;
