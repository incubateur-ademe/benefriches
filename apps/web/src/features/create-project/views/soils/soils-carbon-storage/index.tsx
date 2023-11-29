import SiteSoilsCarbonStorage from "./ProjectSoilsCarbonStorage";

import {
  goToStep,
  ProjectCreationStep,
} from "@/features/create-project/application/createProject.reducer";
import { fetchCarbonStorageForSiteAndProjectSoils } from "@/features/create-project/application/soilsCarbonStorage.actions";
import { SoilType } from "@/shared/domain/soils";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (
  dispatch: AppDispatch,
  projectData: RootState["projectCreation"]["projectData"],
  siteData: RootState["projectCreation"]["siteData"],
  projectSoilsCarbonStorage: RootState["projectSoilsCarbonStorage"],
) => {
  const siteCityCode = siteData?.address?.cityCode ?? "";
  const siteSoils = siteData?.soilsSurfaceAreas ?? {};
  const projectSoils = projectData.soilsSurfaceAreas ?? {};
  const { loadingState, projectCarbonStorage, siteCarbonStorage } =
    projectSoilsCarbonStorage;

  return {
    onNext: () =>
      dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_INTRODUCTION)),
    fetchSoilsCarbonStorage: async () => {
      await dispatch(
        fetchCarbonStorageForSiteAndProjectSoils({
          cityCode: siteCityCode,
          siteSoils: Object.entries(siteSoils).map(([type, surfaceArea]) => ({
            type: type as SoilType,
            surfaceArea,
          })),
          projectSoils: Object.entries(projectSoils).map(
            ([type, surfaceArea]) => ({
              type: type as SoilType,
              surfaceArea,
            }),
          ),
        }),
      );
    },
    loading: loadingState === "loading",
    projectCarbonStorage,
    siteCarbonStorage,
  };
};

function ProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const projectData = useAppSelector(
    (state) => state.projectCreation.projectData,
  );
  const siteData = useAppSelector((state) => state.projectCreation.siteData);
  const projectSoilsCarbonStorage = useAppSelector(
    (state) => state.projectSoilsCarbonStorage,
  );

  return (
    <SiteSoilsCarbonStorage
      {...mapProps(dispatch, projectData, siteData, projectSoilsCarbonStorage)}
    />
  );
}

export default ProjectSoilsCarbonStorageContainer;
