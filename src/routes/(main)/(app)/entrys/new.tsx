import { createServerAction$, redirect } from "solid-start/server";
import { Button, ErrorLabel, InputComponent } from "~/frontend/components";
import { type VoidComponent } from "solid-js";
import { z } from "zod";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

async function createTimeEntryFn(formData: FormData, { request }: { request: Request }) {
  const userId = await getSession(request);

  const data = await validateFields(
    formData,
    z.object({
      name: z.string(),
      discription: z.string(),
      startTimeLocal: z.coerce.date(),
      endTimeLocal: z.coerce.date(),
    })
  );

  const newEntry = await db.timeEntry.create({
    data: {
      name: data.name,
      discription: data.discription,
      startTime: data.startTimeLocal,
      endTime: data.endTimeLocal,
      userId: userId,
    },
  });

  return redirect("/entrys/id/" + newEntry.id);
}

/* Frontend
  ============================================ */

const NewEntryPage: VoidComponent = () => {
  const [CreateTimeEntryAction, CreateTimeEntry] = createServerAction$(createTimeEntryFn);

  return (
    <div class="m-auto max-w-3xl">
      <CreateTimeEntry.Form>
        <InputComponent
          name="name"
          type="text"
          errorMessage={CreateTimeEntryAction.error?.fieldErrors?.name}
          invalid={CreateTimeEntryAction.error?.fieldErrors?.name}
          lableText="Name:"
          class="w-full"
        />
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
    </div>
  );
};

export default NewEntryPage;
