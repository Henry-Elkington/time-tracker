import { db } from "~/backend/db";
import { z } from "zod";
import { FormError, useSearchParams } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";
import { FormInputs } from "~/frontend/FormInputs";
import { createUserSession, getUser, register } from "~/backend/session";
import { validateFields } from "~/backend/utils";

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
    <main class="container static m-auto flex h-screen flex-col justify-center bg-white">
      <div class="mx-auto flex max-w-2xl flex-col gap-4">
        <Signup.Form>
          <FormInputs
            inputs={[
              { props: { name: "redirectTo", type: "hidden", value: searchParams.redirect ?? "/" } },
              { label: "Email", props: { name: "email", type: "email", required: true } },
              { label: "First Name", props: { name: "firstName", type: "text", required: true } },
              { label: "Last Name", props: { name: "lastName", type: "text", required: true } },
              { label: "Password", props: { name: "password", type: "password", required: true } },
            ]}
            submitLable="Login"
            errors={SignupAction.error}
            pending={SignupAction.pending}
          />
        </Signup.Form>
      </div>
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
  const userExists = await db.user.findUnique({ where: { email: data.email } });
  if (userExists) {
    throw new FormError(`User with email ${data.email} already exists`, { fields });
  }
  const user = await register(data);
  if (!user) {
    throw new FormError(`Something went wrong trying to create a new user.`, { fields });
  }

  return createUserSession(`${user.id}`, data.redirectTo ?? "/");
}
