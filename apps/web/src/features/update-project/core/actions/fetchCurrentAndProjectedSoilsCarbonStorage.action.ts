import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/features/create-project/core/project-form/soilsCarbonStorage.types";

import { selectSiteAddress } from "../updateProject.selectors";
import {
  selectProjectSoilsDistribution,
  selectSiteSoilsDistribution,
} from "../updateProjectRenewableEnergy.selectors";

const UPDATE_PROJECT_STORE_KEY = "projectUpdate";

export const fetchCurrentAndProjectedSoilsCarbonStorageForUpdate =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    `${UPDATE_PROJECT_STORE_KEY}/fetchCurrentAndProjectedSoilsCarbonStorage`,
    async (_, { extra, getState }) => {
      const rootState = getState();
      const siteAddress = selectSiteAddress(rootState);
      const siteSoils = selectSiteSoilsDistribution(rootState);
      const projectSoils = selectProjectSoilsDistribution(rootState);

      if (!siteAddress) throw new Error("Missing site address");

      const [current, projected] = await Promise.all([
        extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          cityCode: siteAddress.cityCode,
          soils: siteSoils,
        }),
        extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          soils: projectSoils,
          cityCode: siteAddress.cityCode,
        }),
      ]);

      return {
        current,
        projected,
      };
    },
  );
