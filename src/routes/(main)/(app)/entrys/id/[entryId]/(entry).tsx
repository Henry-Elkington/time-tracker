import { EntryType } from "perf_hooks";
import { For, type VoidComponent } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";

/* Data Fetching
  ============================================ */

export const routeData = ({ params }: RouteDataArgs) => {
  console.log();

  const timeEntrys = createServerData$(
    async ([id], { request }) => {
      const userId = await getSession(request);
      const entry = await db.timeEntry.findUnique({ where: { id: id } });
      if (entry === null) return new Error();
      return {
        id: entry.id,
        name: entry.name,
        discription: entry.discription,
        lenth: entry.endTime.getTime() - entry.startTime.getTime(),
      };
    },
    { key: [params.entryId] }
  );

  return { timeEntrys: timeEntrys };
};

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const EntryPage: VoidComponent = () => {
  const { timeEntrys } = useRouteData<typeof routeData>();
  return <div>{JSON.stringify(timeEntrys())}</div>;
};

export default EntryPage;
