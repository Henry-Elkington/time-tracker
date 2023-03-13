import { Project } from "@prisma/client";
import { For, Suspense, VoidComponent } from "solid-js";
import { A, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { Card, Page, buttonStyles } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = (RouteDataArgs: RouteDataArgs) => {
  const projects = createServerData$(async (_, { request }) => {
    await new Promise((res) => setTimeout(res, 1000));

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
    <Page
      title="Projects"
      right={
        <A href="/projects/new" class={buttonStyles}>
          New
        </A>
      }
    >
      <Suspense fallback="Loading...">
        <div class="flex flex-col gap-4">
          <For each={projects()}>
            {(project) => (
              <A href={"/projects/id/" + project.id}>
                <Card class="p-2">{project.name}</Card>
              </A>
            )}
          </For>
        </div>
      </Suspense>
    </Page>
  );
};

export default UsersPage;
