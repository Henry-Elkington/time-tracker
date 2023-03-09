import { For, VoidComponent } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { z } from "zod";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { Button, ErrorLabel, InputComponent, Label, buttonStyles } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  const users = createServerData$(async () => {
    return await db.user.findMany({ select: { firstName: true, lastName: true, id: true } });
  });

  return { users: users };
};

/* Actions
  ============================================ */

async function createProjectFn(formData: FormData, { request }: { request: Request }) {
  const userId = await getSession(request);

  for (const pair of formData.entries()) {
    console.log(`${pair[0]}, ${pair[1]}, ${pair[1][1]}`);
  }

  // const data = await validateFields(
  //   formData,
  //   z.object({
  //     name: z.string(),
  //     discription: z.string(),
  //   })
  // );

  // console.log(data);

  // const newProject = await db.project.create({
  //   data: {
  //     name: data.name,
  //     discription: data.discription,
  //     adminId: userId,
  //     Employers: {
  //       connect: {
  //         id:
  //       }
  //     }
  //   },
  // });

  // return redirect("/project/id/" + newProject.id);
}

/* Frontend
  ============================================ */

const NewProjectPage: VoidComponent = () => {
  const { users } = useRouteData<typeof routeData>();

  const [CreateProjectAction, CreateProject] = createServerAction$(createProjectFn);

  return (
    <div class="m-auto max-w-3xl">
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
          name="discription"
          type="text"
          errorMessage={CreateProjectAction.error?.fieldErrors?.discription}
          invalid={CreateProjectAction.error?.fieldErrors?.discription}
          lableText="discription:"
          class="w-full"
        />
        <div>
          <Label invalid={CreateProjectAction.error?.fieldErrors?.employers}>Employers:</Label>
          <select name="employers" multiple class="w-full rounded-sm border-gray-300">
            <For each={users()}>
              {(user) => (
                <option value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              )}
            </For>
          </select>
          <ErrorLabel>{CreateProjectAction.error?.fieldErrors?.employers}</ErrorLabel>
        </div>
        <div>
          <Label invalid={CreateProjectAction.error?.fieldErrors?.employees}>Employees:</Label>
          <select name="employees" multiple class="w-full rounded-sm border-gray-300">
            <For each={users()}>
              {(user) => (
                <option value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              )}
            </For>
          </select>
          <ErrorLabel>{CreateProjectAction.error?.fieldErrors?.employees}</ErrorLabel>
        </div>
        <div class="flex flex-col pt-2">
          <Button disabled={CreateProjectAction.pending} loading={CreateProjectAction.pending}>
            Create
          </Button>
          <ErrorLabel>{CreateProjectAction.error?.message}</ErrorLabel>
        </div>
      </CreateProject.Form>
    </div>
  );
};

export default NewProjectPage;
