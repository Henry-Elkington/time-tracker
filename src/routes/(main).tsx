import { A, Outlet, useRouteData } from "solid-start";
import { type ServerFunctionEvent, createServerAction$, createServerData$, redirect } from "solid-start/server";
import type { Component, JSX } from "solid-js";
import { createSignal, Show, type VoidComponent } from "solid-js";

import { getSession, deleteSession } from "~/backend/session";
import { Card } from "~/frontend/components";
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
const NavLink: Component<{ name: string; href: string; end: boolean }> = (props) => {
  return (
    <A href={props.href} class="flex items-center justify-center px-5" activeClass="bg-neutral-200" end={props.end}>
      {props.name}
    </A>
  );
};
const NavButton: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement> & { open: boolean }> = (props) => {
  return (
    <button
      class="flex h-full w-full items-center justify-center px-5"
      classList={{ "bg-neutral-200": props.open }}
      {...props}
    />
  );
};
const DropDown: Component<{ target: JSX.Element; dropDown: JSX.Element; open: boolean }> = (props) => {
  return (
    <div class="relative">
      {props.target}
      <Show when={props.open}>{props.dropDown}</Show>
    </div>
  );
};
const DropDownLink: Component<{ href: string; text: string }> = (props) => {
  return (
    <A href={props.href} class="flex items-center justify-end p-2 px-4 hover:bg-neutral-200">
      {props.text}
    </A>
  );
};
const DropDownButton: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return <button class="flex items-center justify-end p-2 px-4 hover:bg-neutral-200" {...props} />;
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
              <NavLink end={true} href="/" name="Home" />
              <NavLink end={false} href="/entrys" name="Entrys" />
              <NavLink end={false} href="/projects" name="Projects" />
              <NavLink end={false} href="/users" name="Users" />
            </>
          }
          right={
            <DropDown
              target={
                <NavButton open={dropDownOpen()} onClick={() => setDropDownOpen((s) => !s)}>
                  <p class="mr-3">
                    {user()?.firstName} {user()?.lastName}
                  </p>
                  <img src="/default-user.png" class="h-7 w-7 rounded-full" />
                </NavButton>
              }
              dropDown={
                <Card class="absolute top-full -right-[1px] z-10 flex flex-col items-stretch divide-y divide-gray-300 bg-neutral-100 text-right">
                  <DropDownLink href="settings" text="Settings" />
                  <DropDownButton onClick={() => Logout()} name="logout" type="submit">
                    Logout
                  </DropDownButton>
                  <pre>{JSON.stringify(LogoutAction)}</pre>
                </Card>
              }
              open={dropDownOpen()}
            />
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
