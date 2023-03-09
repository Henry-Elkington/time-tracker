import { EntryType } from "perf_hooks";
import { For, Show, type VoidComponent } from "solid-js";
import { ErrorBoundary, RouteDataArgs, useRouteData } from "solid-start";
import { HttpStatusCode, createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { Card } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = ({ params }: RouteDataArgs) => {
  const timeEntry = createServerData$(
    async ([id], { request }) => {
      const userId = await getSession(request);

      const entry = await db.timeEntry.findFirst({ where: { AND: { id: id, userId: userId } } });

      if (!entry) throw new Error("entry not found");

      return {
        id: entry.id,
        name: entry.name,
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
    <ErrorBoundary fallback={(e) => <div>404: entry not found</div>}>
      <Show when={timeEntry()}>
        <div class="m-auto max-w-3xl border">
          <div class="flex justify-between p-3">
            <p>{timeEntry()!.name}</p>
            <p>{timeEntry()!.discription}</p>
            <p>
              {Math.floor(timeEntry()!.lenth / 60 / 60 / 1000)}h - {Math.floor(timeEntry()!.lenth / 60 / 1000) % 60}m
            </p>
          </div>
        </div>
      </Show>
    </ErrorBoundary>
  );
};

export default EntryPage;
