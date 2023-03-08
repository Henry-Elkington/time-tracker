import { z } from "zod";
import { A, FormError } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";

import { db } from "~/backend";
import { createSession, getLackOfSession } from "~/backend/session";
import { validateFields } from "~/backend/utils";
import { InputComponent, Button, Card, ErrorLabel, Input } from "~/frontend/components";

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

async function signupFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  const data = await validateFields(
    formData,
    z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      password: z.string(),
    })
  );
  const user = await db.user.findUnique({ where: { email: data.email } });
  // const fields = Object.fromEntries(formData);
  if (user) {
    throw new FormError(`User with email ${data.email} already exists`); //, {fields,});
  }

  const newUser = await db.user.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
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
    <main class="flex h-screen flex-col items-center justify-center">
      <Card class="flex w-96 flex-col gap-4 p-5">
        <Signup.Form class="flex flex-col gap-3">
          <h1 class="text-center font-semibold">Login</h1>
          <InputComponent
            name="email"
            type="email"
            errorMessage={SignupAction.error?.fieldErrors?.email}
            invalid={false}
            lableText="Email:"
            class="w-full"
          />
          <InputComponent
            name="firstName"
            type="text"
            errorMessage={SignupAction.error?.fieldErrors?.email}
            invalid={false}
            lableText="First Name:"
            class="w-full"
          />
          <InputComponent
            name="lastName"
            type="text"
            errorMessage={SignupAction.error?.fieldErrors?.email}
            invalid={false}
            lableText="Last Name:"
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
          <label class="flex w-fit text-sm">
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
      </Card>
    </main>
  );
};

export default Signup;
