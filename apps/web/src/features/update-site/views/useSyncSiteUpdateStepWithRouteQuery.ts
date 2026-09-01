import { useEffect } from "react";

import { routes, useRoute } from "@/app/router";

export const useSyncSiteUpdateStepWithRouteQuery = (siteStepQueryString: string) => {
  const currentRoute = useRoute();

  useEffect(() => {
    if (currentRoute.name !== routes.updateSite.name) return;

    routes
      .updateSite({
        ...currentRoute.params,
        etape: siteStepQueryString,
      })
      .push();
    // we don't care about other parameters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoute.name, siteStepQueryString]);
};
