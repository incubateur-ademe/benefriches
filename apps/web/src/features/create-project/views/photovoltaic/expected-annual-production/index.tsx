import { useEffect } from "react";
import PhotovoltaicExpectedAnnualProductionForm from "./ExpectedAnnualProductionForm";

import {
  completePhotovoltaicExpectedAnnualProduction,
  revertPhotovoltaicExpectedAnnualProduction,
} from "@/features/create-project/application/createProject.reducer";
import { fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation } from "@/features/create-project/application/pvExpectedPerformanceStorage.actions";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicExpectedAnnualProductionContainer() {
  const dispatch = useAppDispatch();

  const { loadingState, expectedPerformanceMwhPerYear } = useAppSelector(
    (state) => state.projectPvExpectedPerformancesStorage,
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
