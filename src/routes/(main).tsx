import { db } from "~/backend/db";
import { z } from "zod";
import { FormError, Outlet, RouteDataArgs } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";
import { FormInputs } from "~/frontend/FormInputs";
import { getCreateSessionHeaders, getSession } from "~/backend/session";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  const user = createServerData$(async (_, { request }) => {
    const session = (await getSession(request)) as string;
    if (session) {
      return await db.user.findFirst({ where: { id: session } });
    }
    return undefined;
  });

  return { user: user };
};

/* Frontend
  ============================================ */

// Page Component
const MainLayout: VoidComponent = () => {
  const { user } = useRouteData<typeof routeData>();

  // const [LogoutAction, Logout] = createServerAction$(loginFn);

  return (
    <>
      <div class="border-b border-gray-300 bg-gray-100">
        <nav class="container mx-auto flex h-12 items-stretch justify-between">
          <div>hi</div>
          <div class="flex items-center gap-3">
            <p>{user()?.firstName + " " + user()?.lastName}</p>
            <button class="rounded-sm border border-gray-300 bg-white px-2 transition-all hover:border-gray-400">
              logout
            </button>
          </div>
        </nav>
      </div>

      <Outlet />
    </>
  );
};

export default MainLayout;

/* Actions
  ============================================ */

async function loginFn(formData: FormData) {
  await new Promise((res) => setTimeout(res, 3000));

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
