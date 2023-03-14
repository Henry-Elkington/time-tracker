import type { RouteDataArgs } from "solid-start";
import { Show, Suspense, type VoidComponent } from "solid-js";
import { ErrorBoundary, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { Card, Page } from "~/frontend/layoutComponents";

/* Data Fetching
  ============================================ */

export const routeData = ({ params }: RouteDataArgs) => {
  const timeEntry = createServerData$(
    async ([id], { request }) => {
      await new Promise((res) => setTimeout(res, 500));

      const userId = await getSession(request);

      const entry = await db.timeEntry.findUnique({
        where: { id: id },
      });
      if (!entry) throw new Error("entry not found");

      const employee = await db.employee.findFirst({ where: { TimeEntrys: { some: { id: id } } } });
      if (employee?.userId !== userId) throw new Error("entry not found");

      return {
        id: entry.id,
        discription: entry.discription,
        lenth: entry.endTime.getTime() - entry.startTime.getTime(),
      };
    },
    { key: [params.entryId] }
  );

  return { timeEntry: timeEntry };
};

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const EntryPage: VoidComponent = () => {
  const { timeEntry } = useRouteData<typeof routeData>();
  return (
    <Page title="Entry" backbutton>
      <Suspense fallback="Loading ...">
        <ErrorBoundary fallback={(e) => <div>404: entry not found</div>}>
          <Show when={timeEntry()}>
            <Card>
              <p class="border-b border-gray-300 p-2 text-xl">{timeEntry.name}</p>
              <p class="p-2">{timeEntry()!.discription}</p>
              <p class="p-2 pt-0">
                {Math.floor(timeEntry()!.lenth / 1000 / 60 / 60)}h - {Math.floor(timeEntry()!.lenth / 1000 / 60)}m
              </p>
            </Card>
          </Show>
        </ErrorBoundary>
      </Suspense>
    </Page>
  );
};

export default EntryPage;
