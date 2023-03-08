import { Component, For, Show, VoidComponent } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { getUserId } from "~/backend/session";
import { Card, Page } from "~/frontend/components";
import { MainLayoutRouteDataType } from "../(main)";
import { A, RouteDataArgs, useRouteData } from "solid-start";
import { db } from "~/backend";

/* Data Fetching
  ============================================ */

export const routeData = (RouteDataArgs: RouteDataArgs<MainLayoutRouteDataType>) => {
  const prodjects = createServerData$(
    async (_, { request }) => {
      const userId = await getUserId(request);
      const employer = await db.project.findMany({ where: { Employers: { some: { id: userId as string } } } });
      const employee = await db.project.findMany({ where: { Employees: { some: { id: userId as string } } } });
      return { employer: employer, employee: employee };
    },
    { key: ["prodjects"] }
  );
  return prodjects;
};

/* Frontend
  ============================================ */

const ProjectCard: Component<{ id: string; name: string; description: string }> = (props) => {
  return (
    <Card class="min-w-max p-4">
      <A href={"/projects/id/" + props.id}>
        <h3 class="text-lg">{props.name}</h3>
        <p class="">{props.description}</p>
      </A>
    </Card>
  );
};

// Page Component
const Profile: VoidComponent = () => {
  const projects = useRouteData<typeof routeData>();

  console.log(projects());

  return (
    <Page title="Projects">
      <Show when={projects()?.employer?.length ? projects()!.employer.length > 0 : false}>
        <h2 class="text-xl">Employer To</h2>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <For each={projects()?.employer}>
            {(project) => <ProjectCard id={project.id} name={project.name} description={project.discription} />}
          </For>
        </div>
      </Show>
      <Show when={projects()?.employee?.length ? projects()!.employee.length > 0 : false}>
        <h2 class="py-3 text-xl">Employee To</h2>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <For each={projects()?.employee}>
            {(project) => <ProjectCard id={project.id} name={project.name} description={project.discription} />}
          </For>
        </div>
      </Show>
    </Page>
  );
};

export default Profile;

/* Actions
  ============================================ */
