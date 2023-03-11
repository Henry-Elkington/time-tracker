import type { VoidComponent } from "solid-js";
import { A } from "solid-start";
import { Page, buttonStyles } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const UsersPage: VoidComponent = () => {
  return (
    <Page
      title="Projects"
      right={
        <div class="flex gap-4">
          <A href="/projects/join" class={buttonStyles}>
            Join
          </A>
          <A href="/projects/new" class={buttonStyles}>
            New
          </A>
        </div>
      }
    >
      projects page
    </Page>
  );
};

export default UsersPage;
