import { For, VoidComponent } from "solid-js";
import { A, useRouteData } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { z } from "zod";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { Button, ErrorLabel, InputComponent, Label, Page, buttonStyles } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

async function createProjectFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 2000));

  const userId = await getSession(request);

  const data = await validateFields(
    formData,
    z.object({
      name: z.string(),
      defaultRate: z.coerce.number(),
    })
  );

  const newProject = await db.project.create({
    data: {
      name: data.name,
      defaultRate: data.defaultRate,
      adminId: userId,
    },
  });

  return redirect("/projects/id/" + newProject.id);
}

/* Frontend
  ============================================ */

const NewProjectPage: VoidComponent = () => {
  const [CreateProjectAction, CreateProject] = createServerAction$(createProjectFn);

  return (
    <Page title="New Project">
      <CreateProject.Form>
        <InputComponent
          name="name"
          type="text"
          errorMessage={CreateProjectAction.error?.fieldErrors?.name}
          invalid={CreateProjectAction.error?.fieldErrors?.name}
          lableText="Name:"
          class="w-full"
        />
        <InputComponent
          name="defaultRate"
          type="number"
          errorMessage={CreateProjectAction.error?.fieldErrors?.defaultRate}
          invalid={CreateProjectAction.error?.fieldErrors?.defaultRate}
          lableText="Default Rate:"
          class="w-full"
        />
        <div class="flex flex-col pt-4">
          <Button disabled={CreateProjectAction.pending} loading={CreateProjectAction.pending}>
            Create
          </Button>
          <ErrorLabel>{CreateProjectAction.error?.message}</ErrorLabel>
        </div>
      </CreateProject.Form>
    </Page>
  );
};

export default NewProjectPage;
