import { useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import PhotovoltaicExpectedAnnualProductionForm from "./ExpectedAnnualProductionForm";

function PhotovoltaicExpectedAnnualProductionContainer() {
  const {
    onBack,
    onRequestStepCompletion,
    onFetchExpectedAnnualPowerPerformance,
    selectExpectedAnnualProductionViewData,
  } = useRenewableEnergyForm();

  const { loadingState, expectedPerformanceMwhPerYear } = useAppSelector(
    selectExpectedAnnualProductionViewData,
  );

  useEffect(() => {
    onFetchExpectedAnnualPowerPerformance();
  }, [onFetchExpectedAnnualPowerPerformance]);

  if (loadingState === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <PhotovoltaicExpectedAnnualProductionForm
      expectedPerformanceMwhPerYear={expectedPerformanceMwhPerYear}
      onSubmit={(data) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
          answers: {
            photovoltaicExpectedAnnualProduction: data.photovoltaicExpectedAnnualProduction,
          },
        });
      }}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicExpectedAnnualProductionContainer;
