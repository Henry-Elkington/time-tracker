import { A, Outlet } from "solid-start";
import { type VoidComponent } from "solid-js";

/* Data Fetching
  ============================================ */

/* Frontend
  ============================================ */

const Settings: VoidComponent = () => {
  return (
    <div>
      <h1 class="p-3 py-5 text-4xl">Settings</h1>
      <hr class="border-neutral-300" />
      <div class="flex">
        <ul class="w-1/4 pt-20">
          <li class="flex flex-col gap-5">
            <A href="/settings/" class="px-3">
              General
            </A>
            <A href="/settings/adipisicing" class="px-3">
              Adipisicing
            </A>
            <A href="/settings/consectetur" class="px-3">
              Consectetur
            </A>
          </li>
        </ul>
        <div class="flex w-3/4 flex-col gap-5 pb-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;

/* Actions
  ============================================ */
