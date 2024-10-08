import { useEffect } from "react";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { selectCurrentStep } from "../application/createSite.reducer";
import { getRouteFromCreationStep } from "./routes";

export const useSyncCreationStepWithRouteQuery = () => {
  const currentStep = useAppSelector(selectCurrentStep);

  useEffect(() => {
    getRouteFromCreationStep(currentStep).push();
  }, [currentStep]);
};
