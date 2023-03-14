import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { Button, ErrorLabel, InputComponent, Page, buttonStyles } from "~/frontend/components";
import { For, type VoidComponent } from "solid-js";
import { z } from "zod";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { FormError, useRouteData } from "solid-start";

/* Data Fetching
  ============================================ */

export const routeData = (RouteDataArgs: RouteDataArgs) => {
  const projects = createServerData$(async (_, { request }) => {
    await new Promise((res) => setTimeout(res, 500));

    const userId = await getSession(request);
    const employees = await db.employee.findMany({
      where: { userId: userId },
      include: { Project: { select: { id: true, name: true } } },
    });

    return employees.map((employee) => {
      return { id: employee.id, name: employee.Project.name };
    });
  });

  return { projects: projects };
};

/* Actions
  ============================================ */

async function createTimeEntryFn(formData: FormData, { request }: { request: Request }) {
  await new Promise((res) => setTimeout(res, 500));

  const userId = await getSession(request);

  const data = await validateFields(
    formData,
    z.object({
      employeeId: z.string(),
      discription: z.string(),
      startTimeLocal: z.coerce.date(),
      endTimeLocal: z.coerce.date(),
    })
  );

  const employee = await db.employee.findUnique({ where: { id: data.employeeId } });
  if (!employee) return new FormError("emoloyee dose not exist");

  const newEntry = await db.timeEntry.create({
    data: {
      employeeId: data.employeeId,
      discription: data.discription,
      startTime: data.startTimeLocal,
      endTime: data.endTimeLocal,
      rate: employee?.defaultRate,
    },
  });

  return redirect("/entrys/" + newEntry.id);
}

/* Frontend
  ============================================ */

const NewEntryPage: VoidComponent = () => {
  const { projects } = useRouteData<typeof routeData>();

  const [CreateTimeEntryAction, CreateTimeEntry] = createServerAction$(createTimeEntryFn);

  return (
    <Page title="New Entry" backbutton>
      <CreateTimeEntry.Form>
        <label for="employeeId">Project:</label>
        <select name="employeeId" id="employeeId">
          <For each={projects()}>{(project) => <option value={project.id}>{project.name}</option>}</For>
        </select>
        <InputComponent
          name="discription"
          type="text"
          errorMessage={CreateTimeEntryAction.error?.fieldErrors?.discription}
          invalid={CreateTimeEntryAction.error?.fieldErrors?.discription}
          lableText="Discription:"
          class="w-full"
        />
        <InputComponent
          name="startTimeLocal"
          type="datetime-local"
          errorMessage={CreateTimeEntryAction.error?.fieldErrors?.startTimeLocal}
          invalid={CreateTimeEntryAction.error?.fieldErrors?.startTimeLocal}
          lableText="Start Time:"
          class="w-full"
        />
        <InputComponent
          name="endTimeLocal"
          type="datetime-local"
          errorMessage={CreateTimeEntryAction.error?.fieldErrors?.endTimeLocal}
          invalid={CreateTimeEntryAction.error?.fieldErrors?.endTimeLocal}
          lableText="End Time:"
          class="w-full"
        />
        <div class="flex flex-col pt-2">
          <Button disabled={CreateTimeEntryAction.pending} loading={CreateTimeEntryAction.pending}>
            Create
          </Button>
          <ErrorLabel>{CreateTimeEntryAction.error?.message}</ErrorLabel>
        </div>
      </CreateTimeEntry.Form>
    </Page>
  );
};

export default NewEntryPage;
