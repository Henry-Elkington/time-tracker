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
  const [UpdatePasswordAction, UpdatePassword] = createServerAction$(UpdatePasswordFn);

  return (
    <>
      <h2 id="profile-settings" class="pt-5 text-2xl">
        Security Settings
      </h2>

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
            <p class="grow text-neutral-500">The password for your account, between 2 and 32 characters.</p>
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
