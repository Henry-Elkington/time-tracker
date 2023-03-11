import type { VoidComponent } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ([projectId], { request }) => {
      await new Promise((res) => setTimeout(res, 1000));

      const userId = await getSession(request);
      return await db.project.findUnique({ where: { id: projectId } });
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

  return <Page title={project()?.name}>{JSON.stringify(project(), null, 2)}</Page>;
};

export default ProjectPage;
