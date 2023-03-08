import { A, Outlet } from "solid-start";
import type { ServerFunctionEvent } from "solid-start/server";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { createSignal, Show, type VoidComponent } from "solid-js";
import { getUser, logout } from "~/backend/session";
import { Card } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export type MainLayoutRouteDataType = typeof routeData;
export const routeData = () => {
  const user = createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });

  return { user: user };
};

/* Actions
  ============================================ */

const logoutFn = (_: void, { request }: ServerFunctionEvent) => logout(request);

/* Frontend
  ============================================ */

// Page Component
const MainLayout: VoidComponent = () => {
  const { user } = useRouteData<typeof routeData>();
  const [LogoutAction, Logout] = createServerAction$(logoutFn);

  const [dropDownOpen, setDropDownOpen] = createSignal(false);

  return (
    <div class="flex h-full w-full flex-col">
      <div class="border-b border-neutral-300 bg-neutral-100">
        <nav class="container mx-auto flex h-10 items-stretch justify-between">
          <div class="flex items-stretch divide-x divide-neutral-300 border-l border-r border-neutral-300">
            <A href="/" class="flex items-center justify-center px-5" activeClass="bg-neutral-200" end={true}>
              Home
            </A>
            <A href="/entrys" class="flex items-center justify-center px-5" activeClass="bg-neutral-200">
              Entry
            </A>
            <A href="/billing" class="flex items-center justify-center px-5" activeClass="bg-neutral-200">
              Billing
            </A>
          </div>
          <div class="flex items-stretch divide-x divide-neutral-300 border-l border-r border-neutral-300">
            <div class="relative flex items-stretch">
              <button
                class="flex items-center justify-center px-5"
                classList={{ "bg-neutral-200": dropDownOpen() }}
                onClick={() => setDropDownOpen(!dropDownOpen())}
              >
                {user()?.firstName + " " + user()?.lastName}
                <img src="/default-user.png" class="ml-3 h-7 w-7 rounded-full" />
              </button>
              <Show when={dropDownOpen()}>
                <Card class="absolute top-full -right-[1px] z-10 flex flex-col items-stretch divide-y divide-gray-300 bg-neutral-100 text-right">
                  <A href="/settings" class="flex items-center justify-end p-2 px-4 hover:bg-neutral-200">
                    Settings
                  </A>
                  <button
                    onClick={() => Logout()}
                    name="logout"
                    type="submit"
                    class="flex items-center justify-end p-2 px-4 hover:bg-neutral-200"
                  >
                    Logout
                  </button>
                </Card>
              </Show>
            </div>
          </div>
        </nav>
      </div>
      <div class="overflow-x-hidden overflow-y-scroll">
        <main class="container m-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
