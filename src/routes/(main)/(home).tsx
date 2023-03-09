import type { VoidComponent } from "solid-js";
import { Outlet } from "solid-start";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const HomePage: VoidComponent = () => {
  return (
    <Page title="Home" right={<></>}>
      home page
    </Page>
  );
};

export default HomePage;
