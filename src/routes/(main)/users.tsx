import { Icon } from "solid-heroicons";
import { magnifyingGlass } from "solid-heroicons/solid";
import type { VoidComponent } from "solid-js";
import { A, Outlet } from "solid-start";
import { Button, buttonStyles, Input, Page } from "~/frontend/components";

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
      right={
        <div class="flex items-center justify-center gap-5">
          <Input
            type="search"
            left={
              <Button class="rounded-l-none border-l-0">
                <Icon path={magnifyingGlass} class="h-4" />
              </Button>
            }
          />
        </div>
      }
    >
      <Outlet />
    </Page>
  );
};

export default UsersLayout;
