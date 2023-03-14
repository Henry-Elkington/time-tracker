import { Project } from "@prisma/client";
import { For, Suspense, VoidComponent } from "solid-js";
import { A, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { twMerge } from "tailwind-merge";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { Card, Page, buttonStyles } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = (RouteDataArgs: RouteDataArgs) => {
  const projects = createServerData$(async (_, { request }) => {
    await new Promise((res) => setTimeout(res, 500));

    const userId = await getSession(request);
    const projects = await db.project.findMany({ where: { adminId: userId } });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
    }));
  });

  return { projects: projects };
};

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const UsersPage: VoidComponent = () => {
  const { projects } = useRouteData<typeof routeData>();

  return (
    <Page title="Projects">
      <A href="/projects/new">
        <p class={twMerge(buttonStyles, "mb-4 w-full")}>New</p>
      </A>
      <Suspense fallback="Loading...">
        <For each={projects()}>
          {(project) => (
            <div class="flex items-center justify-between border-t border-neutral-300 py-2 last:border-y">
              {project.name}
              <A href={"/projects/" + project.id} class={buttonStyles}>
                Open
              </A>
            </div>
          )}
        </For>
      </Suspense>
    </Page>
  );
};

export default UsersPage;
