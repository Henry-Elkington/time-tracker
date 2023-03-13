import { For, Suspense, VoidComponent } from "solid-js";
import { A, FormError, RouteDataArgs, useRouteData } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { z } from "zod";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { Button, Card, ErrorLabel, InputComponent, Page, buttonStyles } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ([projectId], { request }) => {
      await new Promise((res) => setTimeout(res, 1000));

      // validate that the user is the admin
      const userId = await getSession(request);

      const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          adminId: true,
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

async function createEmployeeFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 1000));

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

  return redirect("/projects/id/" + data.id + "/employees");
}

async function deleteEmployeeFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 1000));

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

  return redirect("/projects/id/" + data.projectId + "/employees");
}

/* Frontend
  ============================================ */

const EditEmployeesPage: VoidComponent = () => {
  const project = useRouteData<typeof routeData>();

  const [CreateEmployeeAction, CreateEmployee] = createServerAction$(createEmployeeFn);

  return (
    <Page title={<Suspense fallback="Loading...">Edit {project()?.name}</Suspense>}>
      <Suspense fallback="Loading...">
        <Card class="p-4">
          <CreateEmployee.Form>
            <h1 class="pb-2 text-xl">Add Employee</h1>
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
        </Card>
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

export default EditEmployeesPage;

// import { Icon } from "solid-heroicons";
// import { trash } from "solid-heroicons/outline";
// import { Show, createEffect } from "solid-js";
// import { For, Suspense, VoidComponent, createSignal } from "solid-js";
// import { A, RouteDataArgs, useRouteData } from "solid-start";
// import { createServerAction$, createServerData$, redirect } from "solid-start/server";
// import { z } from "zod";
// import { db } from "~/backend";
// import { getSession } from "~/backend/session";
// import { validateFields } from "~/backend/utils";
// import { Button, Card, Input, Page, buttonStyles } from "~/frontend/components";

// /* Data Fetching
//   ============================================ */

// export function routeData({ params }: RouteDataArgs) {
//   return createServerData$(
//     async ([projectId], { request }) => {
//       await new Promise((res) => setTimeout(res, 1000));

//       // validate that the user is the admin
//       const userId = await getSession(request);
//       const project = await db.project.findUnique({ where: { id: projectId } });
//       if (project?.adminId !== userId) throw redirect("/projects");

//       // get project and employees
//       return await db.project.findUnique({
//         where: { id: projectId },
//         include: {
//           Employee: {
//             include: { User: { select: { name: true, email: true } } },
//           },
//           Admin: {
//             select: { name: true },
//           },
//         },
//       });
//     },
//     { key: [params.projectId] }
//   );
// }

// /* Actions
//   ============================================ */

// // const deleteEmployeeFn = async (formData: FormData, { request }: { request: Request }) => {
// //   await new Promise((res) => setTimeout(res, 1000));

// //   const data = await validateFields(
// //     formData,
// //     z.object({
// //       id: z.string(),
// //     })
// //   );

// //   const deletedEmployee = await db.employee.delete({ where: { id: data.id } });

// //   return redirect("/projects");
// // };

// // const createEmployeeFn = async (
// //   { email, projectId }: { email: string; projectId: string },
// //   { request }: { request: Request }
// // ) => {
// //   await new Promise((res) => setTimeout(res, 1000));

// //   const newEmployee = await db.employee.create({
// //     data: {
// //       defaultRate: 100,
// //       User: {
// //         connect: {
// //           email,
// //         },
// //       },
// //       Project: {
// //         connect: {
// //           id: projectId,
// //         },
// //       },
// //     },
// //   });

// //   return redirect("/projects");
// // };

// /* Frontend
//   ============================================ */

// const ProjectPage: VoidComponent = () => {
//   const project = useRouteData<typeof routeData>();

//   return (
//     <Page
//       title={<Suspense fallback="Loading...">{project()?.name}</Suspense>}
//       right={
//         <div class="flex gap-4">
//           <A href="edit" class={buttonStyles}>
//             Edit
//           </A>
//         </div>
//       }
//     >
//       <Suspense fallback="Loading...">
//         <div class="flex flex-col gap-4">
//           <Card>
//             <p class="border-b border-neutral-300 bg-neutral-600 p-2 font-bold text-white">Project Information</p>
//             <div class="p-2">
//               <p>Project Name: {project()?.name}</p>
//               <p>Admin: {project()?.Admin.name}</p>
//               <p>
//                 Default Pay Rate: $
//                 {project() ? (project()?.defaultRate ? project()!.defaultRate / 100 : "loading...") : "loading..."} /
//                 hour
//               </p>
//             </div>
//           </Card>
//           <Card>
//             <div class="flex justify-between border-b border-neutral-300 bg-neutral-100 p-2 font-bold">
//               <p>Project Employees</p>
//             </div>
//             <div class="p-2">
//               <For each={project()?.Employee}>
//                 {(employee) => (
//                   <div class="flex justify-between">
//                     <p>{employee.User.name}</p>
//                     <div class="flex items-center gap-2">
//                       <p>{employee.User.email}</p>
//                       {/* <DeleteEmployee.Form>
//                           <input type="hidden" name="id" value={employee.id} />
//                           <button type="submit">
//                             <Icon path={trash} class="h-5 w-5" />
//                           </button>
//                         </DeleteEmployee.Form> */}
//                     </div>
//                   </div>
//                 )}
//               </For>
//             </div>
//           </Card>
//         </div>
//       </Suspense>
//     </Page>
//   );
// };

// export default ProjectPage;
