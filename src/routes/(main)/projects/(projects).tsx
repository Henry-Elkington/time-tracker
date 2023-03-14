import { Project } from "@prisma/client";
import { Component, For, JSX, Suspense, VoidComponent } from "solid-js";
import { A, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { twMerge } from "tailwind-merge";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { buttonStyles } from "~/frontend/inputComponents";
import { Page, cardStyles } from "~/frontend/layoutComponents";

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

const ProjectTable: Component<{ head: JSX.Element; body: JSX.Element }> = (props) => {
  return (
    <table class={twMerge(cardStyles, "w-full")}>
      <thead>{props.head}</thead>
      <tbody>{props.body}</tbody>
    </table>
  );
};

const ProjectTableHead: Component = () => {
  return (
    <tr>
      <th scope="col" class="border-gray-300 p-2 text-left">
        Name
      </th>
      <th scope="col" class="border-gray-300 p-2 text-left"></th>
    </tr>
  );
};

const ProjectTableRow: Component<{ name: string; id: string }> = (props) => {
  //   <A href={"/projects/" + project.id} class={buttonStyles}>
  //   Open
  // </A>

  return (
    <tr>
      <td class="border-y border-gray-300 p-2 text-left">{props.name}</td>
      <td class="border-y border-gray-300 p-2 text-right">
        <A href={props.id} class={buttonStyles}>
          Open
        </A>
      </td>
    </tr>
  );
};

const UsersPage: VoidComponent = () => {
  const { projects } = useRouteData<typeof routeData>();

  return (
    <Page
      title="All Projects"
      right={
        <A href="/projects/new" class={buttonStyles}>
          New
        </A>
      }
    >
      <Suspense fallback="Loading...">
        <ProjectTable
          head={<ProjectTableHead />}
          body={<For each={projects()}>{(project) => <ProjectTableRow {...project} />}</For>}
        />
      </Suspense>
    </Page>
  );
};

export default UsersPage;
