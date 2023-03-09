import type { VoidComponent } from "solid-js";
import { A, Outlet } from "solid-start";
import { twMerge } from "tailwind-merge";
import { Button, buttonStyles, Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const EntrysLayout: VoidComponent = () => {
  return (
    <Page
      title="Entrys"
      titleLink="/entrys"
      right={
        <div class="flex items-center justify-center gap-5">
          <A href="/entrys/search" class={buttonStyles}>
            Search
          </A>
          <A href="/entrys/new" class={buttonStyles}>
            New
          </A>
        </div>
      }
    >
      <Outlet />
    </Page>
  );
};

export default EntrysLayout;
