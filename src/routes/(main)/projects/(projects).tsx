import type { VoidComponent } from "solid-js";
import { For } from "solid-js";
import { A, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  const projects = createServerData$(async (_, { request }) => {
    const userId = await getSession(request);
    return await db.project.findMany({
      where: {
        OR: [
          {
            Employees: {
              some: {
                id: userId,
              },
            },
          },
          {
            Employers: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });
  });

  return { projects: projects };
};

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const ProjectsPage: VoidComponent = () => {
  const { projects } = useRouteData<typeof routeData>();

  return (
    <div class="m-auto max-w-3xl divide-y divide-neutral-300 border">
      <For each={projects()}>
        {(project) => (
          <A href={"/projects/id/" + project.id} class="flex justify-between p-3">
            <p>{project.name}</p>
            <p>{project.discription}</p>
          </A>
        )}
      </For>
    </div>
  );
};

export default ProjectsPage;
