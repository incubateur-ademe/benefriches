import { useEffect } from "react";

import { fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation } from "@/features/create-project/core/renewable-energy/actions/getPhotovoltaicExpectedPerformance.action";
import {
  completePhotovoltaicExpectedAnnualProduction,
  revertPhotovoltaicExpectedAnnualProduction,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicExpectedAnnualProductionForm from "./ExpectedAnnualProductionForm";

function PhotovoltaicExpectedAnnualProductionContainer() {
  const dispatch = useAppDispatch();

  const { loadingState, expectedPerformanceMwhPerYear } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.expectedPhotovoltaicPerformance,
  );

  useEffect(() => {
    void dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());
  }, [dispatch]);

  if (loadingState === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <PhotovoltaicExpectedAnnualProductionForm
      expectedPerformanceMwhPerYear={expectedPerformanceMwhPerYear}
      onSubmit={(data) => {
        dispatch(
          completePhotovoltaicExpectedAnnualProduction(data.photovoltaicExpectedAnnualProduction),
        );
      }}
      onBack={() => dispatch(revertPhotovoltaicExpectedAnnualProduction())}
    />
  );
}

export default PhotovoltaicExpectedAnnualProductionContainer;
