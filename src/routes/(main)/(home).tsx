import type { VoidComponent } from "solid-js";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const HomePage: VoidComponent = () => {
  return (
    <Page title="Home" dropDownLinks={[{ text: "test", href: "/" }]}>
      home page
    </Page>
  );
};

export default HomePage;
