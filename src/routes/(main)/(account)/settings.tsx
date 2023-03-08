import type { VoidComponent } from "solid-js";
import { Outlet } from "solid-start";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const SettingsLayout: VoidComponent = () => {
  return (
    <Page title="Settings">
      <Outlet />
    </Page>
  );
};

export default SettingsLayout;
