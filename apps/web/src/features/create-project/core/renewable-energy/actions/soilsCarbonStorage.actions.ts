import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { CurrentAndProjectedSoilsCarbonStorageResult } from "../../../../../shared/core/reducers/project-form/soilsCarbonStorage.action";
import { selectSiteAddress, selectSiteSoilsDistribution } from "../../createProject.selectors";
import { makeRenewableEnergyProjectCreationActionType } from "../renewableEnergy.actions";
import { selectProjectSoilsDistribution } from "../selectors/renewableEnergy.selector";

export const fetchCurrentAndProjectedSoilsCarbonStorage =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    makeRenewableEnergyProjectCreationActionType("fetchCurrentAndProjectedSoilsCarbonStorage"),
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
