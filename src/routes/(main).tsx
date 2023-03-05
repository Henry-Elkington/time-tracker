import { Outlet } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";
import { getUser, logout } from "~/backend/session";
import { Button } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });
};

/* Frontend
  ============================================ */

// Page Component
const MainLayout: VoidComponent = () => {
  const user = useRouteData<typeof routeData>();

  const [LogoutAction, Logout] = createServerAction$((f: FormData, { request }) => logout(request));

  return (
    <>
      <div class="border-b border-gray-300 bg-gray-100">
        <nav class="container mx-auto flex h-12 items-stretch justify-between">
          <div>hi</div>
          <div class="flex items-center gap-3">
            <p>{user()?.firstName + " " + user()?.lastName}</p>
            <Logout.Form>
              <Button name="logout" type="submit">
                Logout
              </Button>
            </Logout.Form>
          </div>
        </nav>
      </div>
      <Outlet />
    </>
  );
};

export default MainLayout;

/* Actions
  ============================================ */
