import { For, Suspense, VoidComponent } from "solid-js";
import { A, FormError, RouteDataArgs, useRouteData } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { z } from "zod";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { Button, ErrorLabel, InputComponent, buttonStyles } from "~/frontend/inputComponents";
import { Page } from "~/frontend/layoutComponents";

/* Data Fetching
  ============================================ */

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ([projectId], { request }) => {
      await new Promise((res) => setTimeout(res, 500));

      const userId = await getSession(request);

      const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          adminId: true,
          Admin: {
            select: {
              email: true,
            },
          },
          name: true,
          Employee: {
            select: {
              id: true,
              User: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      if (project?.adminId !== userId) throw redirect("/projects");

      return project;
    },
    { key: [params.projectId] }
  );
}

/* Actions
  ============================================ */

async function updateProjectFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 500));

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
      name: z.string().min(3),
      adminEmail: z.string().email(),
    })
  );

  const userId = await getSession(request);
  const preProject = await db.project.findUnique({ where: { id: data.id } });
  if (preProject?.adminId !== userId) throw new FormError("Not Authorized");

  const updatedProject = await db.project.update({
    where: { id: data.id },
    data: {
      name: data.name,
      Admin: {
        connect: {
          email: data.adminEmail,
        },
      },
    },
  });

  return redirect("/projects/" + updatedProject.id + "/edit");
}

async function createEmployeeFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 500));

  const data = await validateFields(
    formData,
    z.object({
      id: z.string(),
      email: z.string().email(),
    })
  );

  const userId = await getSession(request);

  const oldProject = await db.project.findUnique({ where: { id: data.id } });
  if (oldProject?.adminId !== userId) throw new FormError("Not Authorized");

  const oldUser = await db.user.findUnique({
    where: { email: data.email },
    include: { Employees: { where: { projectId: data.id } } },
  });
  if (!oldUser) throw new FormError("User with email " + data.email + " dose not exist");

  if (oldUser.Employees.length > 0)
    throw new FormError("User with email " + data.email + " allredy an employee for this project");

  const newEmployee = await db.employee.create({
    data: {
      userId: oldUser.id,
      defaultRate: 1000,
      projectId: data.id,
    },
  });

  return redirect("/projects/" + data.id + "/edit");
}

async function deleteEmployeeFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 500));

  const data = await validateFields(
    formData,
    z.object({
      projectId: z.string(),
      employeeId: z.string(),
    })
  );

  const userId = await getSession(request);
  const oldProject = await db.project.findUnique({ where: { id: data.projectId } });
  if (oldProject?.adminId !== userId) throw new FormError("Not Authorized");

  const deletedEmployee = await db.employee.delete({ where: { id: data.employeeId } });

  return redirect("/projects/" + data.projectId + "/edit");
}

/* Frontend
  ============================================ */

const EditProjectSettinsgPage: VoidComponent = () => {
  const project = useRouteData<typeof routeData>();

  const [UpdateProjectAction, UpdateProject] = createServerAction$(updateProjectFn);
  const [CreateEmployeeAction, CreateEmployee] = createServerAction$(createEmployeeFn);

  return (
    <Page title={<Suspense fallback="Loading...">Edit {project()?.name}</Suspense>} backbutton>
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
            name="adminEmail"
            type="email"
            errorMessage={UpdateProjectAction.error?.fieldErrors?.adminEmail}
            invalid={UpdateProjectAction.error?.fieldErrors?.adminEmail}
            lableText="Admin Email:"
            value={project()?.Admin.email}
            class="w-full"
          />
          <div class="flex flex-col pt-4">
            <Button disabled={UpdateProjectAction.pending} loading={UpdateProjectAction.pending}>
              Update
            </Button>
            <ErrorLabel>{UpdateProjectAction.error?.message}</ErrorLabel>
          </div>
        </UpdateProject.Form>
        <CreateEmployee.Form class="mt-10">
          <input type="hidden" name="id" value={project()?.id} />
          <InputComponent
            name="email"
            type="email"
            errorMessage={CreateEmployeeAction.error?.fieldErrors?.email}
            invalid={CreateEmployeeAction.error?.fieldErrors?.email}
            lableText="Email:"
            value=""
            class="w-full"
          />
          <div class="flex flex-col pt-4">
            <Button disabled={CreateEmployeeAction.pending} loading={CreateEmployeeAction.pending}>
              Add
            </Button>
            <ErrorLabel>{CreateEmployeeAction.error?.message}</ErrorLabel>
          </div>
        </CreateEmployee.Form>
        <div class="py-4">
          <For each={project()?.Employee}>
            {(employee) => {
              const [DeleteEmployeeAction, DeleteEmployee] = createServerAction$(deleteEmployeeFn);
              return (
                <div class="flex justify-between border-t border-neutral-300 py-2 last:border-y">
                  <p>{employee.User.name}</p>
                  <div class="flex gap-4">
                    <p>{employee.User.email}</p>
                    <DeleteEmployee.Form>
                      <input type="hidden" name="projectId" value={project()?.id} />
                      <input type="hidden" name="employeeId" value={employee.id} />
                      <Button>Delete</Button>
                    </DeleteEmployee.Form>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </Suspense>
    </Page>
  );
};

export default EditProjectSettinsgPage;
