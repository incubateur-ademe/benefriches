import { useEffect, useRef } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";

import { selectDemoCurrentStep } from "../core/demo/demo.selectors";
import { selectSiteCreationWizardViewData } from "../core/selectors/createSite.selectors";
import { getRouteFromCreationStep, getRouteFromDemoCreationStep } from "./routes";

export const useSyncCreationStepWithRouteQuery = () => {
  const { currentStep, createMode } = useAppSelector(selectSiteCreationWizardViewData);
  const currentDemoStep = useAppSelector(selectDemoCurrentStep);

  const currentRoute = useRoute();

  // Ref pour avoir toujours les params à jour sans déclencher l'effet
  const currentRouteParamsRef = useRef(currentRoute.params);
  currentRouteParamsRef.current = currentRoute.params;

  useEffect(() => {
    if (currentRoute.name !== routes.createSite.name) return;

    routes
      .createSite({
        ...currentRouteParamsRef.current,
        etape:
          createMode === "express"
            ? getRouteFromDemoCreationStep(currentDemoStep)
            : getRouteFromCreationStep(currentStep),
      })
      .push();
  }, [currentRoute.name, currentStep, createMode, currentDemoStep]);
};
