import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { CurrentAndProjectedSoilsCarbonStorageResult } from "../../actions/soilsCarbonStorage.action";
import { selectSiteAddress, selectSiteSoilsDistribution } from "../../createProject.selectors";
import { selectProjectSoilsDistribution } from "../selectors/renewableEnergy.selector";
import { makeRenewableEnergyProjectCreationActionType } from "./renewableEnergy.actions";

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
