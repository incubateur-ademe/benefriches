import { useEffect, useMemo } from "react";
import CarbonStorageComparisonChart from "./CarbonStorageComparisonChart";

import { fetchCarbonStorageForSiteAndProjectSoils } from "@/shared/application/actions/soilsCarbonStorage.actions";
import { SoilType } from "@/shared/domain/soils";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function CarbonStorageComparisonChartContainer() {
  const dispatch = useAppDispatch();
  const {
    siteData,
    projectData,
    siteCarbonStorage,
    projectCarbonStorage,
    carbonStorageDataLoadingState,
  } = useAppSelector((state) => state.projectDetails);

  const cityCode = siteData?.address.cityCode;
  const siteSoils = useMemo(
    () => siteData?.soilsSurfaceAreas ?? {},
    [siteData?.soilsSurfaceAreas],
  );
  const projectSoils = useMemo(
    () => projectData?.soilsSurfaceAreas ?? {},
    [projectData?.soilsSurfaceAreas],
  );

  useEffect(() => {
    if (cityCode && siteSoils && projectSoils) {
      void dispatch(
        fetchCarbonStorageForSiteAndProjectSoils({
          cityCode,
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
    }
  }, [cityCode, dispatch, projectSoils, siteSoils]);

  if (carbonStorageDataLoadingState === "loading") {
    return <p>Calcul du pouvoir de stockage de carbone par les sols...</p>;
  }

  if (!projectCarbonStorage || !siteCarbonStorage) {
    return <p>Une erreur s’est produite lors du calcul</p>;
  }

  return (
    <CarbonStorageComparisonChart
      projectSoilsStorage={projectCarbonStorage.soilsStorage}
      siteSoilsStorage={siteCarbonStorage.soilsStorage}
    />
  );
}

export default CarbonStorageComparisonChartContainer;
