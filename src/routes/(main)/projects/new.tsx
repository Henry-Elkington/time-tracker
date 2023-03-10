import { VoidComponent } from "solid-js";
import { createServerAction$, redirect } from "solid-start/server";
import { z } from "zod";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { Button, ErrorLabel, InputComponent } from "~/frontend/inputComponents";
import { Page } from "~/frontend/layoutComponents";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

async function createProjectFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 500));

  const userId = await getSession(request);

  const data = await validateFields(
    formData,
    z.object({
      name: z.string(),
    })
  );

  const newProject = await db.project.create({
    data: {
      name: data.name,
      adminId: userId,
    },
  });

  return redirect("/projects/" + newProject.id);
}

/* Frontend
  ============================================ */

const NewProjectPage: VoidComponent = () => {
  const [CreateProjectAction, CreateProject] = createServerAction$(createProjectFn);

  return (
    <Page title="New Project" backbutton>
      <CreateProject.Form>
        <InputComponent
          name="name"
          type="text"
          errorMessage={CreateProjectAction.error?.fieldErrors?.name}
          invalid={CreateProjectAction.error?.fieldErrors?.name}
          lableText="Name:"
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
