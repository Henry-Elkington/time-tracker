import { TimeEntry } from "@prisma/client";
import { Suspense, VoidComponent } from "solid-js";
import { For } from "solid-js";
import type { RouteDataArgs } from "solid-start";
import { A } from "solid-start";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { twMerge } from "tailwind-merge";
import { db } from "~/backend";
import { getSession } from "~/backend/session";
import { Button, Card, Page, buttonStyles } from "~/frontend/components";

/* Data Fetching
  ============================================ */

export const routeData = (RouteDataArgs: RouteDataArgs) => {
  const timeEntrys = createServerData$(async (_, { request }) => {
    await new Promise((res) => setTimeout(res, 500));

    const userId = await getSession(request);
    const entrys = await db.timeEntry.findMany({ where: { Employee: { userId: userId } } });

    return entrys.map((entry) => ({
      id: entry.id,
      discription: entry.discription,
      rate: entry.rate,
      paid: entry.paid,
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
    <Page title="All Entrys">
      <div class="flex flex-col gap-2 ">
        <A href="/entrys/new">
          <p class={twMerge(buttonStyles, "w-full")}>New</p>
        </A>
        <Suspense fallback="Loading...">
          <For each={timeEntrys()}>
            {(timeEntry) => (
              <A href={"/entrys/" + timeEntry.id}>
                <Card>
                  <p class="p-2 pb-0">
                    {Math.floor(timeEntry.lenth / 1000 / 60 / 60)}h - {Math.floor(timeEntry.lenth / 1000 / 60)}m
                  </p>
                  <p class="p-2 pt-0">{timeEntry.discription}</p>
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
