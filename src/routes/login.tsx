import { db } from "~/backend/db";
import { z } from "zod";
import { FormError, RouteDataArgs, useParams, useSearchParams } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { createSignal, For, type VoidComponent } from "solid-js";
import { FormInputs } from "~/frontend/FormInputs";
import { createUserSession, getUser, login } from "~/backend/session";
import { Button, Input } from "~/frontend/components";
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
const Login: VoidComponent = () => {
  const data = useRouteData<typeof routeData>();
  const use = data();
  const [searchParams] = useSearchParams();
  const [LoginAction, Login] = createServerAction$(loginFn);

  return (
    <main class="container static m-auto flex h-screen flex-col justify-center bg-white">
      <div class="mx-auto flex max-w-2xl flex-col gap-4">
        <Login.Form>
          <FormInputs
            inputs={[
              { props: { name: "redirectTo", type: "hidden", value: searchParams.redirect ?? "/" } },
              { label: "Email", props: { name: "email", type: "email", required: true } },
              { label: "Password", props: { name: "password", type: "password", required: true } },
            ]}
            submitLable="Login"
            errors={LoginAction.error}
            pending={LoginAction.pending}
          />
        </Login.Form>
      </div>
    </main>
  );
};

export default Login;

/* Actions
  ============================================ */

async function loginFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      redirectTo: z.string(),
      email: z.string().email(),
      password: z.string(),
    })
  );

  console.log(data);

  const user = await login(data);
  if (!user) {
    throw new FormError(`Email/Password combination is incorrect`); //, {fields,});
  }

  return createUserSession(`${user.id}`, data.redirectTo ?? "/");
}
