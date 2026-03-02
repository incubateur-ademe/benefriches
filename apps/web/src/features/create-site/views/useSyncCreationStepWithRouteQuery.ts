import { useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";

import { selectCurrentStep } from "../core/createSite.reducer";
import { getRouteFromCreationStep } from "./routes";

export const useSyncCreationStepWithRouteQuery = () => {
  const currentStep = useAppSelector(selectCurrentStep);

  useEffect(() => {
    getRouteFromCreationStep(currentStep).push();
  }, [currentStep]);
};
