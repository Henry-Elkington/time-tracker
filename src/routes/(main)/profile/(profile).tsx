import { ServerFunctionEvent, createServerAction$, createServerData$ } from "solid-start/server";
import { Suspense, type VoidComponent } from "solid-js";
import { A, RouteDataArgs } from "solid-start";
import { useRouteData } from "solid-start";

import { db } from "~/backend";
import { deleteSession, getSession } from "~/backend/session";
import { Button, ErrorLabel, InputComponent, Page, buttonStyles } from "~/frontend/components";
import { twJoin, twMerge } from "tailwind-merge";

/* Data Fetching
  ============================================ */

export function routeData({ data }: RouteDataArgs) {
  return createServerData$(async (_, { request }) => {
    await new Promise((res) => setTimeout(res, 500));

    const userId = await getSession(request);

    return await db.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
      },
    });
  });
}

/* Actions
  ============================================ */

const logoutFn = async (formData: FormData, { request }: ServerFunctionEvent) => {
  await new Promise((res) => setTimeout(res, 500));

  return await deleteSession(request);
};

/* Frontend
  ============================================ */

const ProfilePage: VoidComponent = () => {
  const user = useRouteData<typeof routeData>();

  const [LogoutAction, Logout] = createServerAction$(logoutFn);

  return (
    <Page title="Profile">
      <h2 class="text-xl">Email:</h2>
      <p>
        <Suspense fallback="Loading...">{user()?.email}</Suspense>
      </p>

      <h2 class="pt-2 text-xl">Name:</h2>
      <p class="mb-2">
        <Suspense fallback="Loading...">{user()?.name}</Suspense>
      </p>

      <A href="edit">
        <p class={twMerge(buttonStyles, "mb-2 w-full text-center")}>Edit</p>
      </A>

      <Logout.Form>
        <Button loading={LogoutAction.pending} class="w-full">
          Logout
        </Button>
      </Logout.Form>
    </Page>
  );
};

export default ProfilePage;
