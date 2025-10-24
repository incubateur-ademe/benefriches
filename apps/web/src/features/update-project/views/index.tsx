import { useEffect } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import { reconversionProjectUpdateInitiated } from "../core/updateProject.actions";
import UnavailableFeatureView from "./UnavailableFeatureView";
import UrbanProjectUpdateView from "./UrbanProjectUpdateView";

type Props = {
  route: Route<typeof routes.updateProject>;
};

function UpdateProjectPage({ route }: Props) {
  const dispatch = useAppDispatch();

  const projectType = useAppSelector(
    (state) => state.projectUpdate.projectData.features?.developmentPlan.type,
  );
  const isExpressProject = useAppSelector(
    (state) => state.projectUpdate.projectData.features?.isExpress,
  );

  useEffect(() => {
    const projectId = route.params.projectId;
    void dispatch(reconversionProjectUpdateInitiated(projectId));
  }, [dispatch, route.params.projectId]);

  if (projectType === "URBAN_PROJECT" && !isExpressProject) {
    return <UrbanProjectUpdateView />;
  }

  return <UnavailableFeatureView />;
}

export default UpdateProjectPage;
