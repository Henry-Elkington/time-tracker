import type { VoidComponent } from "solid-js";
import { Outlet } from "solid-start";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const NotFoundPage: VoidComponent = () => {
  return <Page title="404: Page Not Found">a</Page>;
};

export default NotFoundPage;
