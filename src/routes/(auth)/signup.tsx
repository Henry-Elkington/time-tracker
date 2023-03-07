import { db } from "~/backend/db";
import { z } from "zod";
import { A, FormError, useSearchParams } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";
import { CreateFields } from "~/frontend/CreateFields";
import { createUserSession, getUser, register } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { Card, Input } from "~/frontend/elements";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  return createServerData$(async (_, { request }) => {
    if (await getUser(request)) {
      throw redirect("/entrys");
    }
    return {};
  });
};

/* Frontend
  ============================================ */

// Page Component
const Signup: VoidComponent = () => {
  const data = useRouteData<typeof routeData>();
  const use = data();
  const [searchParams] = useSearchParams();
  const [SignupAction, Signup] = createServerAction$(signupFn);

  return (
    <main class="flex h-screen flex-col items-center justify-center">
      <Card class="flex w-96 flex-col gap-4">
        <Signup.Form class="flex flex-col gap-3">
          <h1 class="text-center font-semibold">Signup</h1>
          <CreateFields
            hiddenInputs={[{ name: "redirectTo", value: searchParams.redirect ?? "/" }]}
            inputs={[
              { label: "Email", props: { name: "email", type: "email" } },
              { label: "First Name", props: { name: "firstName", type: "text" } },
              { label: "Last Name", props: { name: "lastName", type: "text" } },
              { label: "Password", props: { name: "password", type: "password" } },
            ]}
            submitLable="Login"
            errors={SignupAction.error}
            pending={SignupAction.pending}
          />
        </Signup.Form>
        <div class="flex items-center justify-between">
          <label class="flex w-fit text-sm">
            <Input type="checkbox" class="h-5 w-5 scale-75" />
            Remember Me
          </label>
          <p class="text-right text-xs text-neutral-400">
            Already Have An Account?{" "}
            <A href="/login" class="text-blue-700 hover:underline">
              Login
            </A>
          </p>
        </div>
      </Card>
    </main>
  );
};

export default Signup;

/* Actions
  ============================================ */

async function signupFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      redirectTo: z.string(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      password: z.string(),
    })
  );

  const fields = Object.fromEntries(formData);
  const emailUserExists = await db.user.findUnique({ where: { email: data.email } });
  if (emailUserExists) {
    throw new FormError(`User with email ${data.email} already exists`, { fields });
  }
  const usernameUserExists = await db.user.findUnique({ where: { email: data.email } });
  if (usernameUserExists) {
    throw new FormError(`User with username ${data.email} already exists`, { fields });
  }
  const user = await register(data);
  if (!user) {
    throw new FormError(`Something went wrong trying to create a new user.`, { fields });
  }

  return createUserSession(`${user.id}`, data.redirectTo ?? "/");
}
