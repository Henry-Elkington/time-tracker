import { Show, type VoidComponent } from "solid-js";
import { redirect, RouteDataArgs, useRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { z } from "zod";
import { db } from "~/backend/db";
import { logout } from "~/backend/session";
import { validateFields } from "~/backend/utils";

import { Button, Card, Input, Label } from "~/frontend/elements";
import { MainLayoutRouteDataType } from "~/routes/(main)";

/* Data Fetching
  ============================================ */
export const routeData = ({ data }: RouteDataArgs<MainLayoutRouteDataType>) => {
  return data;
};

/* Frontend
  ============================================ */

const Index: VoidComponent = () => {
  const { user } = useRouteData<typeof routeData>();
  const [UpdateNamesAction, UpdateNames] = createServerAction$(UpdateNamesFn);
  const [UpdateEmailAction, UpdateEmail] = createServerAction$(UpdateEmailFn);
  const [UpdatePasswordAction, UpdatePassword] = createServerAction$(UpdatePasswordFn);

  return (
    <>
      <h2 id="profile-settings" class="pt-5 text-2xl">
        Profile Settings
      </h2>

      <Card class="p-0">
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
          <p class="grow text-neutral-500">The email you use to sign in and get notifications with.</p>
          <Button disabled>Cancel</Button>
          <Button disabled>Update</Button>
        </div>
      </Card>

      <Card class="p-0">
        <UpdateNames.Form>
          <div class="flex flex-col gap-3 p-5">
            <h3 class="text-xl">Your Name</h3>
            <div class="flex gap-3">
              <input type="hidden" name="id" value={user()?.id} />
              <Label class="flex flex-col">
                First Name:
                <Input value={user()?.firstName} type="text" name="firstName" />
              </Label>
              <Label class="flex flex-col">
                Last Name:
                <Input value={user()?.lastName} type="text" name="lastName" />
              </Label>
            </div>
          </div>
          <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
            <p class="grow text-neutral-500">The email you use to sign in and get notifications with.</p>
            <Button type="reset">Cancel</Button>
            <Button disabled={UpdateNamesAction.pending} type="submit">
              <Show when={UpdateNamesAction.pending} fallback="Update">
                Loading...
              </Show>
            </Button>
          </div>
        </UpdateNames.Form>
      </Card>

      <Card class="p-0">
        <UpdateEmail.Form>
          <div class="flex flex-col gap-3 p-5">
            <h3 class="text-xl">Your Email Address</h3>
            <div class="flex gap-3">
              <input type="hidden" name="id" value={user()?.id} />
              <Input value={user()?.email} type="email" name="email" />
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

      <Card class="p-0">
        <div class="flex flex-col gap-3 p-5">
          <h3 class="text-xl">Your ID</h3>
          <div class="flex gap-3">
            <Input readOnly value={user()?.id} type="text" />
          </div>
        </div>
        <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
          <p class="grow py-0.5 text-neutral-500">The email you use to sign in and get notifications with.</p>
        </div>
      </Card>

      <Card class="p-0">
        <UpdatePassword.Form>
          <div class="flex flex-col gap-3 p-5">
            <h3 class="text-xl">Your Password</h3>
            <div class="flex gap-3">
              <input type="hidden" name="id" value={user()?.id} />
              <Label class="flex flex-col">
                Password:
                <Input type="password" name="password" />
              </Label>
              <Label class="flex flex-col">
                Confirm Password:
                <Input type="password" name="confirmPassword" />
              </Label>
            </div>
          </div>
          <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
            <p class="grow text-neutral-500">The email you use to sign in and get notifications with.</p>
            <Button disabled={UpdatePasswordAction.pending} type="submit">
              <Show when={UpdatePasswordAction.pending} fallback="Update">
                Loading...
              </Show>
            </Button>
          </div>
        </UpdatePassword.Form>
      </Card>
    </>
  );
};

export default Index;

/* Actions
  ============================================ */

async function UpdateNamesFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  console.log("fas");

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
  );

  console.log(data);

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
