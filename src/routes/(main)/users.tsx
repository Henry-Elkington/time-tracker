import type { VoidComponent } from "solid-js";
import { A, Outlet } from "solid-start";
import { buttonStyles, Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const UsersLayout: VoidComponent = () => {
  return (
    <Page
      title="Users"
      titleLink="/users"
      right={
        <div class="flex items-center justify-center gap-5">
          <A href="/users/search" class={buttonStyles}>
            Search
          </A>
        </div>
      }
    >
      <Outlet />
    </Page>
  );
};

export default UsersLayout;
