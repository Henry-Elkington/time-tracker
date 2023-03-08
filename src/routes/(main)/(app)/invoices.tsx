import type { VoidComponent } from "solid-js";
import { Outlet } from "solid-start";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const InvoicesLayout: VoidComponent = () => {
  return (
    <Page title="Invoices">
      <Outlet />
    </Page>
  );
};

export default InvoicesLayout;
