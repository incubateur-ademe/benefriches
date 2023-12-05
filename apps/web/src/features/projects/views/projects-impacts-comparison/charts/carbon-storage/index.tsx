import { useEffect } from "react";
import CarbonStorageComparisonChart from "./CarbonStorageComparisonChart";

import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/projects/application/projectDetails.actions";
import { ProjectDetailsState } from "@/features/projects/application/projectDetails.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

type SuccessData = {
  carbonStorageDataLoadingState: Exclude<
    ProjectDetailsState["carbonStorageDataLoadingState"],
    "idle" | "error" | "loading"
  >;
  currentCarbonStorage: Exclude<
    ProjectDetailsState["currentCarbonStorage"],
    undefined
  >;
  projectedCarbonStorage: Exclude<
    ProjectDetailsState["projectedCarbonStorage"],
    undefined
  >;
};

type LoadingOrErrorData = {
  carbonStorageDataLoadingState: Exclude<
    ProjectDetailsState["carbonStorageDataLoadingState"],
    "success"
  >;
  currentCarbonStorage: undefined;
  projectedCarbonStorage: undefined;
};

function CarbonStorageComparisonChartContainer() {
  const dispatch = useAppDispatch();
  const {
    currentCarbonStorage,
    projectedCarbonStorage,
    carbonStorageDataLoadingState,
  } = useAppSelector((state) => state.projectDetails) as
    | SuccessData
    | LoadingOrErrorData;

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
    }
    void fetchData();
  }, [dispatch]);

  if (carbonStorageDataLoadingState === "loading") {
    return <p>Calcul du pouvoir de stockage de carbone par les sols...</p>;
  }

  if (carbonStorageDataLoadingState === "error") {
    return <p>Une erreur s’est produite lors du calcul</p>;
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
