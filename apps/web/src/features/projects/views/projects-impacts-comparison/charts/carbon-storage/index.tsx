import { useEffect } from "react";
import Alert from "@codegouvfr/react-dsfr/Alert";
import CarbonStorageComparisonChart from "./CarbonStorageComparisonChart";

import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/projects/application/projectImpactsComparison.actions";
import { SoilsCarbonStorage } from "@/features/projects/application/projectImpactsComparison.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type SuccessData = {
  carbonStorageDataLoadingState: "success";
  currentCarbonStorage: SoilsCarbonStorage;
  projectedCarbonStorage: SoilsCarbonStorage;
};

type LoadingOrErrorData = {
  carbonStorageDataLoadingState: "idle" | "error" | "loading";
  currentCarbonStorage: undefined;
  projectedCarbonStorage: undefined;
};

function CarbonStorageComparisonChartContainer() {
  const dispatch = useAppDispatch();
  const { currentCarbonStorage, projectedCarbonStorage, carbonStorageDataLoadingState } =
    useAppSelector((state) => ({
      carbonStorageDataLoadingState: state.projectImpactsComparison.carbonStorageDataLoadingState,
      currentCarbonStorage: state.projectImpactsComparison.baseScenario.soilsCarbonStorage,
      projectedCarbonStorage: state.projectImpactsComparison.withScenario.soilsCarbonStorage,
    })) as SuccessData | LoadingOrErrorData;

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
    }
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (carbonStorageDataLoadingState === "loading") {
    return <p>Calcul du pouvoir de stockage de carbone par les sols...</p>;
  }

  if (carbonStorageDataLoadingState === "error") {
    return (
      <Alert
        description="Une erreur s’est produite lors du calcul du pouvoir de stockage de carbone par les sols..."
        severity="error"
        title="Erreur"
        className="fr-my-7v"
      />
    );
  }

  if (carbonStorageDataLoadingState === "success") {
    return (
      <CarbonStorageComparisonChart
        currentCarbonStorage={currentCarbonStorage}
        projectedCarbonStorage={projectedCarbonStorage}
      />
    );
  }
}

export default CarbonStorageComparisonChartContainer;
