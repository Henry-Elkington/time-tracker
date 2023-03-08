import type { VoidComponent } from "solid-js";
import { Page } from "~/frontend/components";

const ErrorPage: VoidComponent = () => {
  return <Page title="404: Page Not Found"></Page>;
};

export default ErrorPage;
