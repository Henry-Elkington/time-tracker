import { type RouteDataArgs, useRouteData } from "solid-start";
import { type VoidComponent } from "solid-js";
import type { MainLayoutRouteDataType } from "../(main)";

/* Data Fetching
  ============================================ */

export type routeDataProfileType = typeof routeData;
export const routeData = ({ data }: RouteDataArgs<MainLayoutRouteDataType>) => {
  return { user: data };
};

/* Frontend
  ============================================ */

// Page Component
const Profile: VoidComponent = () => {
  const { user } = useRouteData<routeDataProfileType>();

  return (
    <div>
      <h1 class="p-5 text-center text-4xl">Home</h1>
    </div>
  );
};

export default Profile;

/* Actions
  ============================================ */
