import type { VoidComponent } from "solid-js";
import { A, Outlet } from "solid-start";
import { buttonStyles, Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const InvoicesLayout: VoidComponent = () => {
  return (
    <Page
      title="Invoices"
      titleLink="/invoices"
      right={
        <div class="flex items-center justify-center gap-5">
          <A href="/invoices/search" class={buttonStyles}>
            Search
          </A>
          <A href="/invoices/new" class={buttonStyles}>
            New
          </A>
        </div>
      }
    >
      <Outlet />
    </Page>
  );
};

export default InvoicesLayout;
