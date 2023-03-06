import { VoidComponent } from "solid-js";
import { Card } from "~/frontend/elements";

const ErrorPage: VoidComponent = () => {
  return (
    <main class="flex h-screen flex-col items-center justify-center">
      <Card class="flex w-96 flex-col gap-4">
        <h1 class="p-10 text-center text-xl font-bold">404: page not found</h1>
      </Card>
    </main>
  );
};

export default ErrorPage;
