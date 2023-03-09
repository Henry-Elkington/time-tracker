import { z } from "zod";
import { A, FormError } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";

import { createSession, getLackOfSession } from "~/backend/session";
import { InputComponent, Card, ErrorLabel, Input, Button } from "~/frontend/components";
import { validateFields } from "~/backend/utils";
import { db } from "~/backend";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  return createServerData$(async (_, { request }) => {
    const userid = await getLackOfSession(request);
    return userid;
  });
};

/* Actions
  ============================================ */

async function loginFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  );

  const user = await db.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw new FormError(`Email/Password combination is incorrect`); //, {fields,});
  }

  if (user.password !== data.password) {
    throw new FormError(`Email/Password combination is incorrect`); //, {fields,});
  }

  return createSession(`${user.id}`); // data.redirectTo ?? "/"
}

/* Frontend
  ============================================ */

const Login: VoidComponent = () => {
  const userId = useRouteData<typeof routeData>();
  const use = userId();

  const [LoginAction, Login] = createServerAction$(loginFn);

  return (
    <main class="flex h-screen flex-col items-center justify-center">
      <Card class="flex w-96 flex-col gap-4 p-5">
        <Login.Form class="flex flex-col gap-3">
          <h1 class="text-center font-semibold">Login</h1>
          <InputComponent
            name="email"
            type="email"
            errorMessage={LoginAction.error?.fieldErrors?.email}
            invalid={false}
            lableText="Email:"
            class="w-full"
          />
          <InputComponent
            name="password"
            type="password"
            errorMessage={LoginAction.error?.fieldErrors?.password}
            invalid={false}
            lableText="Password:"
            class="w-full"
          />
          <div class="flex flex-col pt-3">
            <Button disabled={LoginAction.pending} loading={LoginAction.pending}>
              Login
            </Button>
            <ErrorLabel>{LoginAction.error?.message}</ErrorLabel>
          </div>
        </Login.Form>
        <div class="flex items-center justify-between">
          <label class="flex w-fit text-sm">
            <Input invalid={false} type="checkbox" class="h-5 w-5 scale-75" />
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
