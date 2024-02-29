import SiteSoilsCarbonStorage from "./ProjectSoilsCarbonStorage";

import { AppDispatch } from "@/app/application/store";
import { completeSoilsCarbonStorageStep } from "@/features/create-project/application/createProject.reducer";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/application/soilsCarbonStorage.actions";
import { State } from "@/features/create-project/application/soilsCarbonStorage.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type SuccessData = {
  loadingState: Exclude<State["loadingState"], "idle" | "error" | "loading">;
  current: Exclude<State["current"], undefined>;
  projected: Exclude<State["projected"], undefined>;
};

type LoadingOrErrorData = {
  loadingState: Exclude<State["loadingState"], "success">;
  current: undefined;
  projected: undefined;
};

type PropsState = SuccessData | LoadingOrErrorData;

const mapProps = (dispatch: AppDispatch) => ({
  onNext: () => {
    dispatch(completeSoilsCarbonStorageStep());
  },
  fetchSoilsCarbonStorage: async () => {
    await dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
  },
});

function ProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const { loadingState, current, projected } = useAppSelector(
    (state) => state.projectSoilsCarbonStorage,
  ) as PropsState;

  if (loadingState === "success") {
    return (
      <SiteSoilsCarbonStorage
        {...mapProps(dispatch)}
        loadingState="success"
        currentCarbonStorage={current}
        projectedCarbonStorage={projected}
      />
    );
  }

  return (
    <SiteSoilsCarbonStorage
      {...mapProps(dispatch)}
      loadingState={loadingState}
      currentCarbonStorage={undefined}
      projectedCarbonStorage={undefined}
    />
  );
}

export default ProjectSoilsCarbonStorageContainer;
