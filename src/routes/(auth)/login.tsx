import { db } from "~/backend/db";
import { z } from "zod";
import { A, FormError, RouteDataArgs, useParams, useSearchParams } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { createSignal, For, type VoidComponent } from "solid-js";
import { CreateFields } from "~/frontend/CreateFields";
import { createUserSession, getUser, login } from "~/backend/session";
import { Button, Card, Input } from "~/frontend/elements";
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
    <main class="flex h-screen flex-col items-center justify-center">
      <Card class="flex w-96 flex-col gap-4">
        <Login.Form class="flex flex-col gap-3">
          <h1 class="text-center font-semibold">Login</h1>
          <CreateFields
            hiddenInputs={[{ name: "redirectTo", value: searchParams.redirect ?? "/" }]}
            inputs={[
              { label: "Email", props: { name: "email", type: "email" } },
              { label: "Password", props: { name: "password", type: "password" } },
            ]}
            submitLable="Signup"
            errors={LoginAction.error}
            pending={LoginAction.pending}
          />
        </Login.Form>
        <div class="flex items-center justify-between">
          <label class="flex w-fit text-sm">
            <Input type="checkbox" class="h-5 w-5 scale-75" />
            Remember Me
          </label>
          <p class="text-right text-xs text-neutral-400">
            Dont Have An Account?{" "}
            <A href="/signup" class="text-blue-700 hover:underline">
              Signup
            </A>
          </p>
        </div>
      </Card>
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

  const user = await login(data);
  if (!user) {
    throw new FormError(`Email/Password combination is incorrect`); //, {fields,});
  }

  return createUserSession(`${user.id}`, data.redirectTo ?? "/");
}
