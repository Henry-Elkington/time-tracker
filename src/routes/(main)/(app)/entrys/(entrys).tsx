import { For, type VoidComponent } from "solid-js";
import { A, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { Card } from "~/frontend/components";

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
    <div class="grid grid-cols-4">
      <For each={timeEntrys()}>
        {(entry) => (
          <A href={"/entrys/id/" + entry.id}>
            <Card class="m-3 p-3">
              <h3 class="text-xl">{entry.name}</h3>
              <p>{entry.discription}</p>
              <p>
                {Math.floor(entry.lenth / 60 / 60 / 1000)}h - {Math.floor(entry.lenth / 60 / 1000) % 60}m
              </p>
            </Card>
          </A>
        )}
      </For>
    </div>
  );
};

export default EntrysPage;
