import type { VoidComponent } from "solid-js";
import { Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const EditEntryPage: VoidComponent = () => {
  return (
    <Page
      title="Edit Entry"
      dropDownLinks={[
        { text: "All Entrys", href: "/entrys" },
        { text: "New Entry", href: "/entrys/new" },
      ]}
    >
      <div>hi</div>
    </Page>
  );
};

export default EditEntryPage;
