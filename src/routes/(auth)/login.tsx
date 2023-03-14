import { z } from "zod";
import { A, FormError } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";

import { createSession, getSession } from "~/backend/session";
import { InputComponent, ErrorLabel, Input, Button } from "~/frontend/inputComponents";
import { validateFields } from "~/backend/utils";
import { db } from "~/backend";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  return createServerData$(async (_, { request }) => {
    const userid = await getSession(request, true);
    return userid;
  });
};

/* Actions
  ============================================ */

async function loginFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 500));

  const data = await validateFields(
    formData,
    z.object({
      email: z.string().email(),
      password: z.string().min(5),
    })
  );

  const user = await db.user.findUnique({ where: { email: data.email }, include: { Password: true } });

  if (!user) {
    throw new FormError(`Email is incorrect`); //, {fields,});
  }

  if (user.Password?.password !== data.password) {
    throw new FormError(`Password is incorrect`); //, {fields,}); // Email/Password combination is incorrect
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
    <main class="flex flex-col gap-4 p-5">
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
        <label class="flex w-fit text-xs">
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
    </main>
  );
};

export default Login;
