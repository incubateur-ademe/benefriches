import { useEffect } from "react";
import PhotovoltaicExpectedAnnualProductionForm from "./ExpectedAnnualProductionForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicExpectedAnnualProduction,
} from "@/features/create-project/application/createProject.reducer";
import { fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation } from "@/features/create-project/application/pvExpectedPerformanceStorage.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicExpectedAnnualProductionContainer() {
  const dispatch = useAppDispatch();

  const { loadingState, expectedPerformanceMwhPerYear, computationContext } = useAppSelector(
    (state) => state.projectPvExpectedPerformancesStorage,
  );
  const surfaceArea = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicInstallationSurfaceSquareMeters,
  );

  useEffect(() => {
    void dispatch(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation());
  }, [dispatch]);

  if (loadingState === "loading") {
    return "Chargement des données...";
  }

  return (
    <PhotovoltaicExpectedAnnualProductionForm
      expectedPerformanceMwhPerYear={expectedPerformanceMwhPerYear}
      computationContext={computationContext}
      surfaceArea={surfaceArea}
      onSubmit={(data) => {
        dispatch(
          setPhotovoltaicExpectedAnnualProduction(data.photovoltaicExpectedAnnualProduction),
        );
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_CONTRACT_DURATION));
      }}
    />
  );
}

export default PhotovoltaicExpectedAnnualProductionContainer;
