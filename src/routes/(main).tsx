import { A, Outlet, useRouteData } from "solid-start";
import { type ServerFunctionEvent, createServerAction$, createServerData$ } from "solid-start/server";
import type { Component, JSX } from "solid-js";
import { type VoidComponent } from "solid-js";
import { getSession } from "~/backend/session";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  return createServerData$(async (_, { request }) => {
    const userid = await getSession(request);
    return userid;
  });
};

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const NavBar: Component<{ center: JSX.Element }> = (props) => {
  return (
    <div class="fixed right-0 left-0 bottom-0 bg-neutral-100">
      <nav class="container mx-auto mb-8 flex h-10 items-stretch justify-between border-y border-neutral-300 ">
        <div class="flex w-full divide-x divide-neutral-300 border-l border-r border-neutral-300">{props.center}</div>
      </nav>
    </div>
  );
};
const NavLink: Component<{ name: string; href: string; end: boolean }> = (props) => {
  return (
    <A
      href={props.href}
      class="flex w-full items-center justify-center text-lg"
      activeClass="bg-neutral-200"
      end={props.end}
    >
      {props.name}
    </A>
  );
};

const MainLayout: VoidComponent = () => {
  const userId = useRouteData<typeof routeData>();
  const use = userId();

  return (
    <div class="static">
      <main class="container m-auto">
        <Outlet />
      </main>
      <NavBar
        center={
          <>
            <NavLink end={false} href="/profile" name="Profile" />
            <NavLink end={false} href="/entrys" name="Entrys" />
            <NavLink end={false} href="/projects" name="Projects" />
          </>
        }
      />
    </div>
  );
};

export default MainLayout;
