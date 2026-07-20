import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import PhotovoltaicExpectedAnnualProductionForm from "@/features/create-project/views/photovoltaic-power-station/photovoltaic/expected-annual-production/ExpectedAnnualProductionForm";
import { fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocationForUpdate } from "@/features/update-project/core/actions/fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation.action";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectExpectedAnnualProductionViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

function PhotovoltaicExpectedAnnualProductionContainer() {
  const dispatch = useAppDispatch();

  const { loadingState, expectedPerformanceMwhPerYear } = useAppSelector(
    selectExpectedAnnualProductionViewData,
  );

  useEffect(() => {
    void dispatch(fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocationForUpdate());
  }, [dispatch]);

  if (loadingState === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <PhotovoltaicExpectedAnnualProductionForm
      expectedPerformanceMwhPerYear={expectedPerformanceMwhPerYear}
      onSubmit={(data) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
            answers: {
              photovoltaicExpectedAnnualProduction: data.photovoltaicExpectedAnnualProduction,
            },
          }),
        );
      }}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default PhotovoltaicExpectedAnnualProductionContainer;
