import { type ServerFunctionEvent, createServerAction$ } from "solid-start/server";
import { type VoidComponent } from "solid-js";
import { Button, Page } from "~/frontend/components";

import { deleteSession } from "~/backend/session";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

const logoutFn = async (_: void, { request }: ServerFunctionEvent) => {
  await new Promise((res) => setTimeout(res, 1000));

  return await deleteSession(request);
};

/* Frontend
  ============================================ */

const ProfilePage: VoidComponent = () => {
  const [LogoutAction, Logout] = createServerAction$(logoutFn);

  return (
    <Page title="Profile">
      profile page
      <Logout.Form>
        <Button>Logout</Button>
      </Logout.Form>
    </Page>
  );
};

export default ProfilePage;
