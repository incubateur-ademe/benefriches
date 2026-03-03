import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation } from "@/features/create-project/core/renewable-energy/actions/getPhotovoltaicExpectedPerformance.action";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import PhotovoltaicExpectedAnnualProductionForm from "./ExpectedAnnualProductionForm";

function PhotovoltaicExpectedAnnualProductionContainer() {
  const dispatch = useAppDispatch();

  const { loadingState, expectedPerformanceMwhPerYear } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.expectedPhotovoltaicPerformance,
  );

  useEffect(() => {
    void dispatch(fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation());
  }, [dispatch]);

  if (loadingState === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <PhotovoltaicExpectedAnnualProductionForm
      expectedPerformanceMwhPerYear={expectedPerformanceMwhPerYear}
      onSubmit={(data) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
            answers: {
              photovoltaicExpectedAnnualProduction: data.photovoltaicExpectedAnnualProduction,
            },
          }),
        );
      }}
      onBack={() => dispatch(navigateToPrevious())}
    />
  );
}

export default PhotovoltaicExpectedAnnualProductionContainer;
