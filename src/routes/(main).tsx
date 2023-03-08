import { A, Outlet, useRouteData } from "solid-start";
import { type ServerFunctionEvent, createServerAction$, createServerData$, redirect } from "solid-start/server";
import { Component, createSignal, JSX, Show, type VoidComponent } from "solid-js";

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

const NavBar: Component<{ left: JSX.Element; right: JSX.Element }> = (props) => {
  return (
    <nav class="container mx-auto flex h-10 items-stretch justify-between">
      <div class="flex items-stretch divide-x divide-neutral-300 border-l border-r border-neutral-300">
        {props.left}
      </div>
      <div class="flex items-stretch divide-x divide-neutral-300 border-l border-r border-neutral-300">
        {props.right}
      </div>
    </nav>
  );
};

const NavLink: Component<{ name: string; href: string }> = (props) => {
  return (
    <A href={props.href} class="flex items-center justify-center px-5" activeClass="bg-neutral-200" end={true}>
      {props.name}
    </A>
  );
};

const MainLayout: VoidComponent = () => {
  const { user } = useRouteData<typeof routeData>();
  const [LogoutAction, Logout] = createServerAction$(logoutFn);

  const [dropDownOpen, setDropDownOpen] = createSignal(false);

  return (
    <div class="flex h-full w-full flex-col">
      <div class="border-b border-neutral-300 bg-neutral-100">
        <NavBar
          left={
            <>
              <NavLink href="/" name="Home" />
              <NavLink href="/entrys" name="Entrys" />
              <NavLink href="/invoices" name="Invoices" />
              <NavLink href="/projects" name="Projects" />
              <NavLink href="/users" name="Users" />
            </>
          }
          right={
            <>
              <div class="relative flex items-stretch">
                <button
                  class="flex items-center justify-center px-3 lg:px-5"
                  classList={{ "bg-neutral-200": dropDownOpen() }}
                  onClick={() => setDropDownOpen(!dropDownOpen())}
                >
                  <p class="mr-3 hidden lg:block">{user()?.firstName + " " + user()?.lastName}</p>
                  <img src="/default-user.png" class=" h-7 w-7 rounded-full" />
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
            </>
          }
        />
      </div>
      <div class="touch-pan-y overflow-x-hidden overflow-y-scroll">
        <main class="container m-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
