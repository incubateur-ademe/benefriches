import { useEffect } from "react";
import Alert from "@codegouvfr/react-dsfr/Alert";
import CarbonStorageChart from "./CarbonStorageChart";

import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/projects/application/projectImpacts.actions";
import { ProjectImpactsState } from "@/features/projects/application/projectImpacts.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type SuccessData = {
  carbonStorageDataLoadingState: Exclude<
    ProjectImpactsState["carbonStorageDataLoadingState"],
    "idle" | "error" | "loading"
  >;
  currentCarbonStorage: Exclude<ProjectImpactsState["currentCarbonStorage"], undefined>;
  projectedCarbonStorage: Exclude<ProjectImpactsState["projectedCarbonStorage"], undefined>;
};

type LoadingOrErrorData = {
  carbonStorageDataLoadingState: Exclude<
    ProjectImpactsState["carbonStorageDataLoadingState"],
    "success"
  >;
  currentCarbonStorage: undefined;
  projectedCarbonStorage: undefined;
};

function CarbonStorageChartContainer() {
  const dispatch = useAppDispatch();
  const { currentCarbonStorage, projectedCarbonStorage, carbonStorageDataLoadingState } =
    useAppSelector((state) => state.projectImpacts) as SuccessData | LoadingOrErrorData;

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
      <CarbonStorageChart
        currentCarbonStorage={currentCarbonStorage}
        projectedCarbonStorage={projectedCarbonStorage}
      />
    );
  }
}

export default CarbonStorageChartContainer;
