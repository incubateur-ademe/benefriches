import { useEffect } from "react";

import { routes, useRoute } from "@/shared/views/router";

export const useSyncUpdateStepWithRouteQuery = (projectStepQueryString: string) => {
  const currentRoute = useRoute();

  useEffect(() => {
    if (currentRoute.name !== routes.updateProject.name) return;

    routes
      .updateProject({
        ...currentRoute.params,
        etape: projectStepQueryString,
      })
      .push();
    // we don't care about other parameters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoute.name, projectStepQueryString]);
};
