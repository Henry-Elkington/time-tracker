import { type VoidComponent } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";

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
          <Button disabled>Save</Button>
        </div>
      </Card>

      <Card class="p-0">
        <div class="flex flex-col gap-3 p-5">
          <h3 class="text-xl">Your Username</h3>
          <div class="flex gap-3">
            <Input value={user()?.email} type="text" width="40" />
          </div>
        </div>
        <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
          <p class="grow text-neutral-500">The email you use to sign in and get notifications with.</p>
          <Button disabled>Cancel</Button>
          <Button disabled>Save</Button>
        </div>
      </Card>

      <Card class="p-0">
        <div class="flex flex-col gap-3 p-5">
          <h3 class="text-xl">Your Name</h3>
          <div class="flex gap-3">
            <Label class="flex flex-col">
              First Name:
              <Input value={user()?.firstName} type="text" width="40" />
            </Label>
            <Label class="flex flex-col">
              Last Name:
              <Input value={user()?.lastName} type="text" width="40" />
            </Label>
          </div>
        </div>
        <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
          <p class="grow text-neutral-500">The email you use to sign in and get notifications with.</p>
          <Button disabled>Cancel</Button>
          <Button disabled>Save</Button>
        </div>
      </Card>

      <Card class="p-0">
        <div class="flex flex-col gap-3 p-5">
          <h3 class="text-xl">Your Email Address</h3>
          <div class="flex gap-3">
            <Input value={user()?.email} type="email" width="40" />
          </div>
        </div>
        <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
          <p class="grow text-neutral-500">The email you use to sign in and get notifications with.</p>
          <Button disabled>Cancel</Button>
          <Button disabled>Save</Button>
        </div>
      </Card>

      <Card class="p-0">
        <div class="flex flex-col gap-3 p-5">
          <h3 class="text-xl">Your ID</h3>
          <div class="flex gap-3">
            <Input readOnly value={user()?.id} type="text" width="40" />
          </div>
        </div>
        <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
          <p class="grow py-0.5 text-neutral-500">The email you use to sign in and get notifications with.</p>
        </div>
      </Card>

      <Card class="p-0">
        <div class="flex flex-col gap-3 p-5">
          <h3 class="text-xl">Your Password</h3>
          <div class="flex gap-3">
            <Input readOnly value="*****" type="text" width="40" />
          </div>
        </div>
        <div class="flex items-baseline gap-3 border-t border-neutral-300 bg-neutral-50 p-3 pl-5">
          <p class="grow text-neutral-500">The email you use to sign in and get notifications with.</p>
          <Button disabled>Change Password</Button>
        </div>
      </Card>
    </>
  );
};

export default Index;

/* Actions
  ============================================ */
