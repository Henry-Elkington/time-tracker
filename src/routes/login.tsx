import { db } from "~/backend/db";
import { z } from "zod";
import { FormError, RouteDataArgs } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { createSignal, For, type VoidComponent } from "solid-js";
import { FormInputs } from "~/frontend/FormInputs";
import { getCreateSessionHeaders, getSession } from "~/backend/session";
import { Button, Input } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  const user = createServerData$((_, { request }) => {
    return getSession(request, { whenEmpty: true, url: "/login" });
  });

  return { user: user };
};

/* Frontend
  ============================================ */

// Page Component
const Login: VoidComponent = () => {
  const { user } = useRouteData<typeof routeData>();
  const [LoginAction, Login] = createServerAction$(loginFn);

  return (
    <main class="container static m-auto flex h-screen flex-col justify-center bg-white">
      <div class="mx-auto flex max-w-2xl flex-col gap-4">
        <Login.Form>
          <FormInputs
            inputs={[
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
  // await new Promise((res) => setTimeout(res, 3000));

  const fields = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedFields = z
    .object({
      email: z.string().email(),
      password: z.string(),
    })
    .safeParse(fields);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten((issue) => issue.message).fieldErrors;
    throw new FormError("Fields invalid", { fieldErrors, fields });
  }

  const user = await db.user.findFirst({ where: { email: validatedFields.data.email } });

  if (!user) throw new FormError("Email or password are incorect");

  if (user.passowrd !== validatedFields.data.password) throw new FormError("Email or password are incorect");

  const headers = await getCreateSessionHeaders(user.id);

  return redirect("/", { headers: headers });
}
