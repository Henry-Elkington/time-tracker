import { For, type VoidComponent } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";

/* Data Fetching
  ============================================ */

export const routeData = () => {
  const timeEntrys = createServerData$(async (_, { request }) => {
    const userId = await getSession(request);
    const entrys = await db.timeEntry.findMany({ where: { userId: userId } });
    return entrys.map((entry) => ({
      id: entry.id,
      name: entry.name,
      discription: entry.discription,
      lenth: entry.endTime.getTime() - entry.startTime.getTime(),
    }));
  });

  return { timeEntrys: timeEntrys };
};

/* Actions
  ============================================ */

/* Frontend
  ============================================ */

const EntrysPage: VoidComponent = () => {
  const { timeEntrys } = useRouteData<typeof routeData>();

  return (
    <div>
      <For each={timeEntrys()}>{(entry) => <pre>{JSON.stringify(entry)}</pre>}</For>
    </div>
  );
};

export default EntrysPage;
