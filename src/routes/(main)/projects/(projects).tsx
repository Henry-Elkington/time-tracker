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
        <A href="/projects/new" class={buttonStyles}>
          New
        </A>
      }
    >
      projects page
    </Page>
  );
};

export default UsersPage;
