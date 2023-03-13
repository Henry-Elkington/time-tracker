import { Suspense, VoidComponent } from "solid-js";
import { A, FormError, RouteDataArgs, useRouteData } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { z } from "zod";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { Button, ErrorLabel, InputComponent, Page, buttonStyles } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ([projectId], { request }) => {
      await new Promise((res) => setTimeout(res, 1000));

      // validate that the user is the admin
      const userId = await getSession(request);
      const project = await db.project.findUnique({ where: { id: projectId } });
      if (project?.adminId !== userId) throw redirect("/projects");

      return project;
    },
    { key: [params.projectId] }
  );
}

/* Actions
  ============================================ */

async function updateProjectFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 1000));

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
      name: z.string(),
      adminId: z.string(),
    })
  );

  const userId = await getSession(request);
  const preProject = await db.project.findUnique({ where: { id: data.id } });
  if (preProject?.adminId !== userId) throw new FormError("Not Authorized");

  const updatedProject = await db.project.update({
    where: { id: data.id },
    data: {
      name: data.name,
      adminId: data.adminId,
    },
  });

  return redirect("/projects/id/" + updatedProject.id + "/edit");
}

/* Frontend
  ============================================ */

const EditProjectSettinsgPage: VoidComponent = () => {
  const project = useRouteData<typeof routeData>();

  const [UpdateProjectAction, UpdateProject] = createServerAction$(updateProjectFn);

  return (
    <Page title={<Suspense fallback="Loading...">Edit {project()?.name}</Suspense>}>
      <Suspense fallback="Loading...">
        <UpdateProject.Form>
          <input name="id" value={project()?.id} type="hidden" />
          <InputComponent
            name="name"
            type="text"
            errorMessage={UpdateProjectAction.error?.fieldErrors?.name}
            invalid={UpdateProjectAction.error?.fieldErrors?.name}
            lableText="Project Name:"
            value={project()?.name}
            class="w-full"
          />
          <InputComponent
            name="adminId"
            type="text"
            errorMessage={UpdateProjectAction.error?.fieldErrors?.name}
            invalid={UpdateProjectAction.error?.fieldErrors?.name}
            lableText="Admin Id:"
            value={project()?.adminId}
            class="w-full"
          />
          <div class="flex flex-col pt-4">
            <Button disabled={UpdateProjectAction.pending} loading={UpdateProjectAction.pending}>
              Save
            </Button>
            <ErrorLabel>{UpdateProjectAction.error?.message}</ErrorLabel>
          </div>
        </UpdateProject.Form>
      </Suspense>
    </Page>
  );
};

export default EditProjectSettinsgPage;
