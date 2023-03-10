import type { VoidComponent } from "solid-js";
import { For, Suspense } from "solid-js";
import { RouteDataArgs } from "solid-start";
import { A, useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { buttonStyles } from "~/frontend/inputComponents";
import { Page, Card } from "~/frontend/layoutComponents";

/* Data Fetching
  ============================================ */

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ([projectId], { request }) => {
      await new Promise((res) => setTimeout(res, 500));

      // validate that the user is the admin
      const userId = await getSession(request);
      const project = await db.project.findUnique({ where: { id: projectId } });
      if (project?.adminId !== userId) throw redirect("/projects");

      // get project and employees
      return await db.project.findUnique({
        where: { id: projectId },
        include: {
          Employee: {
            include: { User: { select: { name: true, email: true } } },
          },
          Admin: {
            select: { name: true },
          },
        },
      });
    },
    { key: [params.projectId] }
  );
}

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const ProjectPage: VoidComponent = () => {
  const project = useRouteData<typeof routeData>();

  return (
    <Page
      title="Project"
      right={
        <div class="flex gap-4">
          <A href="edit" class={buttonStyles}>
            Edit
          </A>
        </div>
      }
      backbutton
    >
      <Suspense fallback="Loading...">
        <div class="flex flex-col gap-4">
          <Card>
            <p class="border-b border-neutral-300 bg-neutral-600 p-2 font-bold text-white">Project Information</p>
            <div class="p-2">
              <p>Project Name: {project()?.name}</p>
              <p>Admin: {project()?.Admin.name}</p>
            </div>
          </Card>
          <Card>
            <div class="flex justify-between border-b border-neutral-300 bg-neutral-100 p-2">
              <p>Project Employees</p>
            </div>
            <div class="divide-y divide-neutral-300 p-2">
              <For each={project()?.Employee}>
                {(employee) => (
                  <div class="flex justify-between py-2">
                    <p>{employee.User.name}</p>
                    <p>{employee.User.email}</p>
                  </div>
                )}
              </For>
            </div>
          </Card>
        </div>
      </Suspense>
    </Page>
  );
};

export default ProjectPage;
