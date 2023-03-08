import { type VoidComponent } from "solid-js";
import { Page } from "~/frontend/components";
import { Show } from "solid-js";
import type { RouteDataArgs } from "solid-start";
import { redirect, useRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { z } from "zod";
import { db } from "~/backend";
import { logout } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { Button, Card } from "~/frontend/elements";
import { InputComponent } from "~/frontend/components";
import type { MainLayoutRouteDataType } from "~/routes/(main)";

/* Data Fetching
  ============================================ */
export const routeData = ({ data }: RouteDataArgs<MainLayoutRouteDataType>) => {
  return data;
};

/* Frontend
  ============================================ */

const Settings: VoidComponent = () => {
  const { user } = useRouteData<typeof routeData>();
  const [UpdateNamesAction, UpdateNames] = createServerAction$(UpdateNamesFn);
  const [UpdateEmailAction, UpdateEmail] = createServerAction$(UpdateEmailFn);
  const [UpdatePasswordAction, UpdatePassword] = createServerAction$(UpdatePasswordFn);

  return (
    <Page title="Settings">
      <div class="mx-auto flex max-w-3xl flex-col gap-5">
        <Card>
          <div class="flex items-center justify-between pr-5">
            <div class="flex flex-col gap-3 p-5">
              <h3 class="text-xl">Your Avatar</h3>
              <div class="flex gap-3">
                <p>Click the image to change to a different photo.</p>
              </div>
            </div>
            <img src="/default-user.png" loading="lazy" class="h-16 w-16" decoding="async" />
          </div>
          <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
            <p class="grow text-neutral-500">Your Avatar. This will be shown to other people.</p>
            <Button disabled>Cancel</Button>
            <Button disabled>Update</Button>
          </div>
        </Card>

        <Card>
          <UpdateNames.Form>
            <div class="flex flex-col gap-3 p-5">
              <h3 class="text-xl">Your Name</h3>
              <div class="flex gap-3">
                <input type="hidden" name="id" value={user()?.id} />
                <InputComponent
                  value={user()?.firstName}
                  type="text"
                  name="firstName"
                  errorMessage=""
                  invalid={false}
                  lableText="First Name:"
                />
                <InputComponent
                  value={user()?.lastName}
                  type="text"
                  name="lastName"
                  errorMessage=""
                  invalid={false}
                  lableText="Last Name:"
                />
              </div>
            </div>
            <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
              <p class="grow text-neutral-500">Your first and last name. This will be shown to other people.</p>
              <Button type="reset">Cancel</Button>
              <Button disabled={UpdateNamesAction.pending} type="submit">
                <Show when={UpdateNamesAction.pending} fallback="Update">
                  Loading...
                </Show>
              </Button>
            </div>
          </UpdateNames.Form>
        </Card>

        <Card>
          <UpdateEmail.Form>
            <div class="flex flex-col gap-3 p-5">
              <h3 class="text-xl">Your Email Address</h3>
              <div class="flex gap-3">
                <input type="hidden" name="id" value={user()?.id} />
                <InputComponent
                  value={user()?.email}
                  type="email"
                  name="email"
                  errorMessage=""
                  invalid={false}
                  lableText="Email:"
                />
              </div>
            </div>
            <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
              <p class="grow text-neutral-500">The email you use to sign in and get notifications with.</p>
              <Button type="reset">Cancel</Button>
              <Button disabled={UpdateEmailAction.pending} type="submit">
                <Show when={UpdateEmailAction.pending} fallback="Update">
                  Loading...
                </Show>
              </Button>
            </div>
          </UpdateEmail.Form>
        </Card>

        <Card>
          <div class="flex flex-col gap-3 p-5">
            <h3 class="text-xl">Your ID</h3>
            <div class="flex gap-3">
              <InputComponent
                readOnly
                value={user()?.id}
                type="text"
                name="id"
                errorMessage=""
                invalid={false}
                lableText="Id:"
              />
            </div>
          </div>
          <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
            <p class="grow py-0.5 text-neutral-500">Your accounts Unique Identifier. You cannot change this.</p>
          </div>
        </Card>

        <Card>
          <UpdatePassword.Form>
            <div class="flex flex-col gap-3 p-5">
              <h3 class="text-xl">Your Password</h3>
              <div class="flex gap-3">
                <input type="hidden" name="id" value={user()?.id} />
                <InputComponent
                  value=""
                  type="password"
                  name="password"
                  errorMessage=""
                  invalid={false}
                  lableText="Password:"
                />
                <InputComponent
                  value=""
                  type="password"
                  name="confirmPassword"
                  errorMessage=""
                  invalid={false}
                  lableText="Confirm Password:"
                />
              </div>
            </div>
            <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
              <p class="grow text-neutral-500">The password for your account, between 2 and 32 characters.</p>
              <Button type="reset">Cancel</Button>
              <Button disabled={UpdatePasswordAction.pending} type="submit">
                <Show when={UpdatePasswordAction.pending} fallback="Update">
                  Loading...
                </Show>
              </Button>
            </div>
          </UpdatePassword.Form>
        </Card>
      </div>
    </Page>
  );
};

export default Settings;

/* Actions
  ============================================ */

async function UpdateNamesFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
  );

  await db.user.update({
    where: {
      id: data.id,
    },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  return redirect("/settings");
}
async function UpdateEmailFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
      email: z.string(),
    })
  );

  await db.user.update({
    where: {
      id: data.id,
    },
    data: {
      email: data.email,
    },
  });

  return redirect("/settings");
}
async function UpdatePasswordFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    })
  );

  await db.user.update({
    where: {
      id: data.id,
    },
    data: {
      password: data.password,
    },
  });

  return logout(request);
}
