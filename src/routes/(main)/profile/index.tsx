import { type ServerFunctionEvent, createServerAction$, createServerData$, redirect } from "solid-start/server";
import { type VoidComponent } from "solid-js";
import { Button, ErrorLabel, Input, InputComponent, Page } from "~/frontend/components";

import { deleteSession, getSession } from "~/backend/session";
import { FormError, RouteDataArgs, useRouteData } from "solid-start";
import { db } from "~/backend";
import { z } from "zod";
import { validateFields } from "~/backend/utils";

/* Data Fetching
  ============================================ */

export function routeData({ data }: RouteDataArgs) {
  return createServerData$(async (_, { request }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const userId = await getSession(request);
    return await db.user.findUnique({ where: { id: userId } });
  });
}

/* Actions
  ============================================ */

const logoutFn = async (formData: FormData, { request }: ServerFunctionEvent) => {
  await new Promise((res) => setTimeout(res, 2000));

  return await deleteSession(request);
};

const updateProfileFn = async (formData: FormData, { request }: ServerFunctionEvent) => {
  await new Promise((res) => setTimeout(res, 2000));

  const userId = await getSession(request);

  const data = await validateFields(
    formData,
    z.object({
      email: z.string(),
      name: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    })
  );

  if (data.password !== data.confirmPassword) throw new FormError("Passwords Dont Match");
  if (data.password.length < 1) {
    await db.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        name: data.name,
        Password: {
          update: {
            password: data.password,
          },
        },
      },
    });
  } else {
    await db.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }

  return redirect("/profile");
};

/* Frontend
  ============================================ */

const ProfilePage: VoidComponent = () => {
  const user = useRouteData<typeof routeData>();

  const [LogoutAction, Logout] = createServerAction$(logoutFn);
  const [UpdateProfileAction, UpdateProfile] = createServerAction$(updateProfileFn);

  return (
    <Page
      title="Profile"
      right={
        <Logout.Form>
          <Button loading={LogoutAction.pending}>Logout</Button>
        </Logout.Form>
      }
    >
      <UpdateProfile.Form class="flex flex-col gap-2">
        <InputComponent
          value={user()?.email}
          type="text"
          name="email"
          errorMessage=""
          invalid={false}
          lableText="Email:"
          class="w-full"
        />
        <InputComponent
          value={user()?.name}
          type="text"
          name="name"
          errorMessage=""
          invalid={false}
          lableText="Name:"
          class="w-full"
        />
        <InputComponent
          value=""
          type="password"
          name="password"
          errorMessage=""
          invalid={false}
          lableText="Password:"
          class="w-full"
        />
        <InputComponent
          value=""
          type="password"
          name="confirmPassword"
          errorMessage=""
          invalid={false}
          lableText="Confirm Password:"
          class="w-full"
        />
        <div class="flex flex-col pt-4">
          <Button disabled={UpdateProfileAction.pending} loading={UpdateProfileAction.pending}>
            Update
          </Button>
          <ErrorLabel>{UpdateProfileAction.error?.message}</ErrorLabel>
        </div>
      </UpdateProfile.Form>
      <p class="p-5 text-center">{user()?.id}</p>
    </Page>
  );
};

export default ProfilePage;
