import { A, Outlet, useRouteData } from "solid-start";
import { type ServerFunctionEvent, createServerAction$, createServerData$, redirect } from "solid-start/server";
import type { Component, JSX } from "solid-js";
import { createSignal, Show, type VoidComponent } from "solid-js";

import { getSession, deleteSession } from "~/backend/session";
import { Card, DropDown, DropDownButton, DropDownLink } from "~/frontend/components";
import { db } from "~/backend";

/* Data Fetching
  ============================================ */

export type MainLayoutRouteDataType = typeof routeData;
export const routeData = () => {
  const user = createServerData$(async (_, { request }) => {
    const userId = await getSession(request);

    return db.user.findUnique({ where: { id: userId } });
  });

  return { user: user };
};

/* Actions
  ============================================ */

const logoutFn = async (_: void, { request }: ServerFunctionEvent) => {
  await new Promise((res) => setTimeout(res, 1000));

  return await deleteSession(request);
};

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
const NavButton: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement> & { open: boolean }> = (props) => {
  return <button class="h-full w-max shrink-0 px-1 text-lg" classList={{ "bg-neutral-200": props.open }} {...props} />;
};

const MainLayout: VoidComponent = () => {
  const { user } = useRouteData<typeof routeData>();

  const [LogoutAction, Logout] = createServerAction$(logoutFn);

  const [dropDownOpen, setDropDownOpen] = createSignal(false);

  return (
    <div class="static">
      <main class="container m-auto">
        <Outlet />
      </main>
      <NavBar
        center={
          <>
            <NavLink end={true} href="/" name="Home" />
            <NavLink end={false} href="/entrys" name="Entrys" />
            <NavLink end={false} href="/projects" name="Projects" />
            <NavLink end={false} href="/users" name="Users" />
            <DropDown
              target={
                <NavButton open={dropDownOpen()} onClick={() => setDropDownOpen((s) => !s)}>
                  <img src="/images/app/default-user.png" class="h-8 w-8 rounded-full" />
                </NavButton>
              }
              dropDown={
                <Card class="absolute bottom-full -right-px z-10 flex flex-col items-stretch divide-y divide-gray-300 bg-neutral-100 text-right">
                  <DropDownLink href="settings" text="Settings" />
                  <DropDownButton onClick={() => Logout()} name="logout" type="submit">
                    Logout
                  </DropDownButton>
                </Card>
              }
              open={dropDownOpen()}
            />
          </>
        }
      />
    </div>
  );
};

{
  /* <DropDownLink
href="settings"
text={
  <>
    {user()?.firstName} + {user()?.lastName}
  </>
}
/> */
}

export default MainLayout;
