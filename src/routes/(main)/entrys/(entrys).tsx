import { Suspense, VoidComponent } from "solid-js";
import { For } from "solid-js";
import type { RouteDataArgs } from "solid-start";
import { A } from "solid-start";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { Card, Page } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = (RouteDataArgs: RouteDataArgs) => {
  const timeEntrys = createServerData$(async (_, { request }) => {
    await new Promise((res) => setTimeout(res, 1000));

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

const entrysPage: VoidComponent = () => {
  const { timeEntrys } = useRouteData<typeof routeData>();

  return (
    <Page
      title="All Entrys"
      dropDownLinks={[
        { text: "All Entrys", href: "/entrys" },
        { text: "New Entry", href: "/entrys/new" },
      ]}
    >
      <div class="flex flex-col gap-2 ">
        <Suspense fallback="Loading ...">
          <For each={timeEntrys()}>
            {(timeEntry) => (
              <A href={"/entrys/id/" + timeEntry.id}>
                <Card>
                  <p class="border-b border-gray-300 p-2 text-xl">{timeEntry.name}</p>
                  <p class="p-2">{timeEntry.discription}</p>
                  <p class="p-2 pt-0">
                    {Math.floor(timeEntry.lenth / 1000 / 60 / 60)}h - {Math.floor(timeEntry.lenth / 1000 / 60)}m
                  </p>
                </Card>
              </A>
            )}
          </For>
        </Suspense>
      </div>
    </Page>
  );
};

export default entrysPage;

//   <Input
//   type="search"
//   left={
//     <Button class="rounded-l-none border-l-0">
//       <Icon path={magnifyingGlass} class="h-4" />
//     </Button>
//   }
// />
