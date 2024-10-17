import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { selectSiteAddress, selectSiteSoilsDistribution } from "../createProject.selectors";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "../soilsCarbonStorage.actions";
import { prefixActionType } from "./urbanProject.actions";
import { selectUrbanProjectSoilsDistribution } from "./urbanProject.selectors";

export const fetchCurrentAndProjectedSoilsCarbonStorage =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    prefixActionType("fetchCurrentAndProjectedSoilsCarbonStorage"),
    async (_, { extra, getState }) => {
      const rootState = getState();
      const siteAddress = selectSiteAddress(rootState);
      const siteSoils = selectSiteSoilsDistribution(rootState);
      const projectSoils = selectUrbanProjectSoilsDistribution(rootState);

      if (!siteAddress) throw new Error("Missing site address");

      const [current, projected] = await Promise.all([
        await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          cityCode: siteAddress.cityCode,
          soils: siteSoils,
        }),
        await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
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
