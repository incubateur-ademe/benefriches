import { useEffect } from "react";
import { selectCurrentStep } from "../application/createSite.reducer";
import { getRouteFromCreationStep } from "./routes";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

export const useSyncCreationStepWithRouteQuery = () => {
  const currentStep = useAppSelector(selectCurrentStep);

  useEffect(() => {
    getRouteFromCreationStep(currentStep).push();
  }, [currentStep]);
};
