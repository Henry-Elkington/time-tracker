// --- Backend --- //
// --------------- //
import { db } from "~/backend/db";

// Utils
function getStringFromForm(form: FormData, name: string): string {
  const value = form.get(name);
  if (typeof value !== "string" || value.length < 1) throw new Error("bad data at" + name);
  return value;
}

// Loading Functions
const getUsersFn = async () => {
  return await db.user.findMany();
};

// Action Functions
async function createUserFn(formData: FormData) {
  try {
    const email = getStringFromForm(formData, "email");
    const firstName = getStringFromForm(formData, "firstName");
    const lastName = getStringFromForm(formData, "lastName");
    const passowrd = getStringFromForm(formData, "passowrd");

    await db.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        passowrd: passowrd,
      },
    });

    return redirect("/users");
  } catch {
    return redirect("/users");
  }
}
async function updateUserFn(formData: FormData) {
  try {
    const id = getStringFromForm(formData, "id");
    const email = getStringFromForm(formData, "email");
    const firstName = getStringFromForm(formData, "firstName");
    const lastName = getStringFromForm(formData, "lastName");
    const passowrd = getStringFromForm(formData, "passowrd");

    await db.user.update({
      where: {
        id: id,
      },
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        passowrd: passowrd,
      },
    });

    return redirect("/users");
  } catch {
    return redirect("/users");
  }
}
async function deleteUserFn(formData: FormData) {
  try {
    const id = getStringFromForm(formData, "id");

    await db.user.delete({
      where: {
        id: id,
      },
    });

    return redirect("/users");
  } catch {
    return redirect("/users");
  }
}

// --- Frontend --- //
// ---------------- //
import { createServerAction$, createServerData$, createServerMultiAction$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type Component, For, Show, type VoidComponent } from "solid-js";
import type { User } from "@prisma/client";

// Data Fetching
export function routeData() {
  const users = createServerData$(getUsersFn, { key: ["users"] });
  return { users: users };
}

// Page Component
const TimeTracker: VoidComponent = () => {
  const { users } = useRouteData<typeof routeData>();

  const [CreateUserAction, CreateUser] = createServerAction$(createUserFn);
  const CreateUserForm: Component = () => {
    return (
      <CreateUser.Form class="m-1 flex h-fit flex-col gap-2 border p-2">
        <label for="email">
          email:
          <input type="text" name="email" class="bg-gray-100" />
        </label>
        <label for="firstName">
          firstName:
          <input type="text" name="firstName" class="bg-gray-100" />
        </label>
        <label for="lastName">
          lastName:
          <input type="text" name="lastName" class="bg-gray-100" />
        </label>
        <label for="passowrd">
          passowrd:
          <input type="text" name="passowrd" class="bg-gray-100" />
        </label>
        <button type="submit" disabled={CreateUserAction.pending} class="bg-gray-100">
          <Show when={CreateUserAction.pending} fallback="Submit">
            Loading...
          </Show>
        </button>
      </CreateUser.Form>
    );
  };

  const [UpdateUserAction, UpdateUser] = createServerMultiAction$(updateUserFn);
  const UpdateUserForm: Component<{ user: User }> = (props) => {
    return (
      <UpdateUser.Form class="mb-2 flex h-fit flex-col gap-2">
        <input type="hidden" name="id" value={props.user.id} />
        <label for="email">
          email:
          <input type="text" name="email" value={props.user.email} class="bg-gray-100" />
        </label>
        <label for="firstName">
          firstName:
          <input type="text" name="firstName" value={props.user.firstName} class="bg-gray-100" />
        </label>
        <label for="lastName">
          lastName:
          <input type="text" name="lastName" value={props.user.lastName} class="bg-gray-100" />
        </label>
        <label for="passowrd">
          passowrd:
          <input type="text" name="passowrd" value={props.user.passowrd} class="bg-gray-100" />
        </label>
        <button
          type="submit"
          disabled={UpdateUserAction.find((el) => el.input.get("id") === props.user.id) !== undefined}
          class="bg-gray-100"
        >
          <Show
            when={UpdateUserAction.find((el) => el.input.get("id") === props.user.id) !== undefined}
            fallback="Update"
          >
            Loading...
          </Show>
        </button>
      </UpdateUser.Form>
    );
  };

  const [DeleteUserAction, DeleteUser] = createServerMultiAction$(deleteUserFn);
  const DeleteTimeEntryForm: Component<{ user: User }> = (props) => {
    return (
      <DeleteUser.Form class="flex h-fit flex-col gap-2">
        <input type="hidden" name="id" value={props.user.id} />
        <button
          type="submit"
          disabled={DeleteUserAction.find((el) => el.input.get("id") === props.user.id) !== undefined}
          class="bg-red-100 px-2"
        >
          <Show
            when={DeleteUserAction.find((el) => el.input.get("id") === props.user.id) !== undefined}
            fallback="Delete"
          >
            Loading...
          </Show>
        </button>
      </DeleteUser.Form>
    );
  };

  return (
    <main class="container m-auto bg-white">
      <h1 class="p-5 text-center text-4xl">Time Tracker</h1>
      <div class="flex">
        <div class="flex-1">
          <CreateUserForm />
        </div>
        <div class="flex-1">
          <For each={users()}>
            {(user) => (
              <div class="m-1 border p-2">
                <UpdateUserForm user={user} />
                <DeleteTimeEntryForm user={user} />
              </div>
            )}
          </For>
        </div>
      </div>
    </main>
  );
};

export default TimeTracker;
