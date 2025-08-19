import { useEffect } from "react";

import { routes, useRoute } from "@/shared/views/router";

export const useSyncCreationStepWithRouteQuery = (projectCreationStepQueryString: string) => {
  const currentRoute = useRoute();

  useEffect(() => {
    if (currentRoute.name !== routes.createProject.name) return;

    routes
      .createProject({
        ...currentRoute.params,
        etape: projectCreationStepQueryString,
      })
      .push();
    // we don't care about other parameters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoute.name, projectCreationStepQueryString]);
};
