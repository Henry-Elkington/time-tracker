import type { VoidComponent } from "solid-js";
import { Outlet } from "solid-start";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const UsersLayout: VoidComponent = () => {
  return (
    <Page title="Users">
      <Outlet />
    </Page>
  );
};

export default UsersLayout;
