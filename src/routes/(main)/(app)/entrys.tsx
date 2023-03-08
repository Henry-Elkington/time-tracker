import type { VoidComponent } from "solid-js";
import { Outlet } from "solid-start";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const EntrysLayout: VoidComponent = () => {
  return (
    <Page title="Entrys">
      <Outlet />
    </Page>
  );
};

export default EntrysLayout;
