import type { VoidComponent } from "solid-js";
import { Icon } from "solid-heroicons";
import { magnifyingGlass } from "solid-heroicons/solid";
import { A, Outlet } from "solid-start";
import { Button, buttonStyles, Input, Page } from "~/frontend/components";

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
      right={
        <div class="flex items-center justify-center gap-2">
          <Input
            type="search"
            left={
              <Button class="rounded-l-none border-l-0">
                <Icon path={magnifyingGlass} class="h-4" />
              </Button>
            }
          />
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
