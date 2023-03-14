import { type ServerFunctionEvent, createServerAction$, createServerData$, redirect } from "solid-start/server";
import { Suspense, type VoidComponent } from "solid-js";
import { Button, ErrorLabel, InputComponent } from "~/frontend/inputComponents";
import { Page } from "~/frontend/layoutComponents";

import { getSession } from "~/backend/session";
import { FormError, RouteDataArgs, useRouteData } from "solid-start";
import { db } from "~/backend";
import { z } from "zod";
import { validateFields } from "~/backend/utils";

/* Data Fetching
  ============================================ */

export function routeData({ data }: RouteDataArgs) {
  return createServerData$(async (_, { request }) => {
    await new Promise((res) => setTimeout(res, 500));

    const userId = await getSession(request);

    return await db.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
      },
    });
  });
}

/* Actions
  ============================================ */

const updateProfileFn = async (formData: FormData, { request }: ServerFunctionEvent) => {
  await new Promise((res) => setTimeout(res, 500));

  const userId = await getSession(request);

  const data = await validateFields(
    formData,
    z.object({
      email: z.string().email(),
      name: z.string().min(3),
    })
  );

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      email: data.email,
      name: data.name,
    },
  });

  return redirect("/profile");
};

const updatePasswordFn = async (formData: FormData, { request }: ServerFunctionEvent) => {
  await new Promise((res) => setTimeout(res, 500));

  const userId = await getSession(request);

  const data = await validateFields(
    formData,
    z.object({
      password: z.string().min(5),
      confirmPassword: z.string().min(5),
    })
  );

  if (data.password !== data.confirmPassword) throw new FormError("passwords dont match");

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      Password: {
        update: {
          password: data.password,
        },
      },
    },
  });

  return redirect("/profile");
};

/* Frontend
  ============================================ */

const EditProfilePage: VoidComponent = () => {
  const user = useRouteData<typeof routeData>();

  const [UpdateProfileAction, UpdateProfile] = createServerAction$(updateProfileFn);
  const [UpdatePasswordAction, UpdatePassword] = createServerAction$(updatePasswordFn);

  return (
    <Page title="Edit Profile" backbutton>
      <UpdateProfile.Form class="flex flex-col gap-2 pb-10">
        <Suspense
          fallback={
            <>
              <InputComponent
                value="loading..."
                type="text"
                name="email"
                errorMessage={UpdateProfileAction.error?.fieldErrors?.email}
                invalid={UpdateProfileAction.error?.fieldErrors?.email}
                lableText="Email:"
                class="w-full"
              />
              <InputComponent
                value="loading..."
                type="text"
                name="name"
                errorMessage={UpdateProfileAction.error?.fieldErrors?.name}
                invalid={UpdateProfileAction.error?.fieldErrors?.name}
                lableText="Name:"
                class="w-full"
              />
            </>
          }
        >
          <InputComponent
            value={user()?.email}
            type="text"
            name="email"
            errorMessage={UpdateProfileAction.error?.fieldErrors?.email}
            invalid={UpdateProfileAction.error?.fieldErrors?.email}
            lableText="Email:"
            class="w-full"
          />
          <InputComponent
            value={user()?.name}
            type="text"
            name="name"
            errorMessage={UpdateProfileAction.error?.fieldErrors?.name}
            invalid={UpdateProfileAction.error?.fieldErrors?.name}
            lableText="Name:"
            class="w-full"
          />
        </Suspense>
        <div class="flex flex-col pt-4">
          <Button disabled={UpdateProfileAction.pending} loading={UpdateProfileAction.pending}>
            Update
          </Button>
          <ErrorLabel>{UpdateProfileAction.error?.message}</ErrorLabel>
        </div>
      </UpdateProfile.Form>
      <UpdatePassword.Form>
        <InputComponent
          value=""
          type="text"
          name="password"
          errorMessage={UpdatePasswordAction.error?.fieldErrors?.password}
          invalid={UpdatePasswordAction.error?.fieldErrors?.password}
          lableText="New Password:"
          class="w-full"
        />
        <InputComponent
          value=""
          type="text"
          name="confirmPassword"
          errorMessage={UpdatePasswordAction.error?.fieldErrors?.confirmPassword}
          invalid={UpdatePasswordAction.error?.fieldErrors?.confirmPassword}
          lableText="Confirm New Password:"
          class="w-full"
        />
        <div class="flex flex-col pt-4">
          <Button disabled={UpdatePasswordAction.pending} loading={UpdatePasswordAction.pending}>
            Change Password
          </Button>
          <ErrorLabel>{UpdatePasswordAction.error?.message}</ErrorLabel>
        </div>
      </UpdatePassword.Form>
    </Page>
  );
};

export default EditProfilePage;
