import { z } from "zod";
import { A, FormError } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";

import { db } from "~/backend";
import { createSession, getSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { InputComponent, Button, ErrorLabel, Input } from "~/frontend/inputComponents";

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

async function signupFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 500));

  const data = await validateFields(
    formData,
    z.object({
      email: z.string().email(),
      name: z.string().min(3),
      password: z.string().min(5),
    })
  );

  const user = await db.user.findUnique({ where: { email: data.email } });
  if (user) {
    throw new FormError(`User with email ${data.email} already exists`); //, {fields,});
  }

  const newUser = await db.user.create({
    data: {
      email: data.email,
      name: data.name,
      Password: { create: { password: data.password } },
    },
  });

  return createSession(`${newUser.id}`); // data.redirectTo ?? "/"
}

/* Frontend
  ============================================ */

const Signup: VoidComponent = () => {
  const userId = useRouteData<typeof routeData>();
  const use = userId();

  const [SignupAction, Signup] = createServerAction$(signupFn);

  return (
    <main class="flex flex-col gap-4 p-5">
      <Signup.Form class="flex flex-col gap-3">
        <h1 class="text-center font-semibold">Signup</h1>
        <InputComponent
          name="email"
          type="email"
          errorMessage={SignupAction.error?.fieldErrors?.email}
          invalid={false}
          lableText="Email:"
          class="w-full"
        />
        <InputComponent
          name="name"
          type="text"
          errorMessage={SignupAction.error?.fieldErrors?.name}
          invalid={false}
          lableText="Name:"
          class="w-full"
        />
        <InputComponent
          name="password"
          type="password"
          errorMessage={SignupAction.error?.fieldErrors?.password}
          invalid={false}
          lableText="Password:"
          class="w-full"
        />
        <div class="flex flex-col pt-3">
          <Button disabled={SignupAction.pending} loading={SignupAction.pending}>
            Signup
          </Button>
          <ErrorLabel>{SignupAction.error?.message}</ErrorLabel>
        </div>
      </Signup.Form>
      <div class="flex items-center justify-between">
        <label class="flex w-fit text-xs">
          <Input invalid={false} type="checkbox" class="h-5 w-5 scale-75" />
          Remember Me
        </label>
        <p class="text-right text-xs text-neutral-400">
          Already Have An Account?{" "}
          <A href="/login" class="text-blue-700 hover:underline">
            Login
          </A>
        </p>
      </div>
    </main>
  );
};

export default Signup;
