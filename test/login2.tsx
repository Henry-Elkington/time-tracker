import { Show } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import { db } from "~/backend/db";
import { createUserSession, getUser, login, register } from "~/backend/session";

function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    return `emails must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

export function routeData() {
  return createServerData$(async (_, { request }) => {
    if (await getUser(request)) {
      throw redirect("/");
    }
    return {};
  });
}

const loginFn = async (form: FormData) => {
  const loginType = form.get("loginType");
  const email = form.get("email");
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/";
  if (
    typeof loginType !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    throw new FormError(`Form not submitted correctly.`);
  }

  const fields = { loginType, email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    throw new FormError("Fields invalid", { fieldErrors, fields });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ email, password });
      if (!user) {
        throw new FormError(`Umail/Password combination is incorrect`, {
          fields,
        });
      }
      return createUserSession(`${user.id}`, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findUnique({ where: { email } });
      if (userExists) {
        throw new FormError(`User with email ${email} already exists`, {
          fields,
        });
      }
      const user = await register({ email, firstName, lastName, password } as {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
      });
      if (!user) {
        throw new FormError(`Something went wrong trying to create a new user.`, {
          fields,
        });
      }
      return createUserSession(`${user.id}`, redirectTo);
    }
    default: {
      throw new FormError(`Login type invalid`, { fields });
    }
  }
};

export default function Login() {
  const data = useRouteData<typeof routeData>();
  const params = useParams();

  const [loggingIn, { Form }] = createServerAction$(loginFn);

  return (
    <main>
      <h1>Login</h1>
      <Form>
        <input type="hidden" name="redirectTo" value={params.redirectTo ?? "/"} />
        <fieldset>
          <legend>Login or Register?</legend>
          <label>
            <input type="radio" name="loginType" value="login" checked={true} /> Login
          </label>
          <label>
            <input type="radio" name="loginType" value="register" /> Register
          </label>
        </fieldset>
        <div>
          <label for="email-input">Email</label>
          <input name="email" placeholder="kody" />
        </div>
        <Show when={loggingIn.error?.fieldErrors?.email}>
          <p role="alert">{loggingIn.error.fieldErrors.email}</p>
        </Show>
        <div>
          <label for="first-name-input">First Name</label>
          <input name="password" type="text" placeholder="twixrox" />
        </div>
        <div>
          <label for="last-name-input">Last Name</label>
          <input name="password" type="text" placeholder="twixrox" />
        </div>
        <div>
          <label for="password-input">Password</label>
          <input name="password" type="password" placeholder="twixrox" />
        </div>
        <Show when={loggingIn.error?.fieldErrors?.password}>
          <p role="alert">{loggingIn.error.fieldErrors.password}</p>
        </Show>
        <button type="submit">{data() ? "Login" : ""}</button>
        <Show when={loggingIn.error}>
          <p role="alert" id="error-message">
            {loggingIn.error.message}
          </p>
        </Show>
      </Form>
    </main>
  );
}
