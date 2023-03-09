import type { VoidComponent } from "solid-js";
import { A, Outlet } from "solid-start";
import { buttonStyles, Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const ProjectsLayout: VoidComponent = () => {
  return (
    <Page
      title="Projects"
      titleLink="/projects"
      right={
        <div class="flex items-center justify-center gap-5">
          <A href="/projects/search" class={buttonStyles}>
            Search
          </A>
          <A href="/projects/new" class={buttonStyles}>
            New
          </A>
        </div>
      }
    >
      <Outlet />
    </Page>
  );
};

export default ProjectsLayout;
