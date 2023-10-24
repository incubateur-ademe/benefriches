import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FricheActivity } from "@/features/create-site/domain/friche.types";
import {
  Expense,
  OwnerType,
  SiteFoncier,
  SoilType,
} from "@/features/create-site/domain/siteFoncier.types";

export type SiteCreationState = {
  step: SiteCreationStep;
  siteData: Partial<SiteFoncier>;
};

const isSoilTypePrairie = (soilType: SoilType) => {
  return soilType.startsWith("PRAIRIE");
};
const isSoilTypeForest = (soilType: SoilType) => {
  return soilType.startsWith("FOREST");
};
const isSoilTypeAgricultural = (soilType: SoilType) => {
  return [SoilType.VINEYARD, SoilType.ORCHARD, SoilType.CULTIVATION].includes(
    soilType,
  );
};
const isSoilTypeArtificial = (soilType: SoilType) => {
  return [
    SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
    SoilType.ARTIFICIAL_TREE_FILLED,
    SoilType.MINERAL_SOIL,
    SoilType.BUILDINGS,
  ].includes(soilType);
};
const isSoilTypeNatural = (soilType: SoilType) => {
  return (
    isSoilTypePrairie(soilType) ||
    isSoilTypeForest(soilType) ||
    soilType === SoilType.WATER ||
    soilType === SoilType.WET_LAND
  );
};

export const getSiteTypeLabel = (siteData: SiteCreationState["siteData"]) => {
  if (siteData.isFriche) return "friche";

  const { soils = [] } = siteData;

  const nonArtificialSoils = soils.filter(
    (soilType) => !isSoilTypeArtificial(soilType),
  );
  if (nonArtificialSoils.length === 0) return "espace";
  if (nonArtificialSoils.every(isSoilTypePrairie)) return "prairie";
  if (nonArtificialSoils.every(isSoilTypeForest)) return "forêt";
  if (nonArtificialSoils.every(isSoilTypeAgricultural))
    return "espace agricole";
  if (nonArtificialSoils.every(isSoilTypeNatural)) return "espace naturel";
  return "espace naturel et agricole";
};

export enum SiteCreationStep {
  SITE_TYPE = "SITE_TYPE",
  ADDRESS = "ADDRESS",
  // soils
  SOILS_INTRODUCTION = "SOILS_INTRODUCTION",
  SURFACE_AREA = "SURFACE_AREA",
  SOILS = "SOILS",
  SOILS_SURFACE_AREAS = "SOILS_SURFACE_AREAS",
  SOILS_SUMMARY = "SOILS_SUMMARY",
  SOILS_CARBON_SEQUESTRATION = "SOILS_CARBON_SEQUESTRATION",
  // contamination
  SOIL_CONTAMINATION = "SOIL_CONTAMINATION",
  // site management
  MANAGEMENT_INTRODUCTION = "MANAGEMENT_INTRODUCTION",
  OWNER = "OWNER",
  TENANT = "TENANT",
  FULL_TIME_JOBS_INVOLVED = "FULL_TIME_JOBS_INVOLVED",
  RECENT_ACCIDENTS = "RECENT_ACCIDENTS",
  FRICHE_SECURING_EXPENSES = "FRICHE_SECURING_EXPENSES",
  // NAMING
  FRICHE_ACTIVITY = "FRICHE_ACTIVITY",
  NAMING = "NAMING",
  CREATION_CONFIRMATION = "CREATION_CONFIRMATION",
}

export const siteCreationInitialState: SiteCreationState = {
  step: SiteCreationStep.SITE_TYPE,
  siteData: {
    soils: [],
    yearlyExpenses: [],
  },
};

export const siteCreationSlice = createSlice({
  name: "siteCreation",
  initialState: siteCreationInitialState,
  reducers: {
    setSurfaceArea: (state, action: PayloadAction<number>) => {
      state.siteData.surfaceArea = action.payload;
    },
    setIsFriche: (state, action: PayloadAction<boolean>) => {
      state.siteData.isFriche = action.payload;
    },
    setAddress: (state, action: PayloadAction<SiteFoncier["address"]>) => {
      state.siteData.address = action.payload;
      state.step = SiteCreationStep.SOILS_INTRODUCTION;
    },
    setSoils: (state, action: PayloadAction<SoilType[]>) => {
      state.siteData.soils = action.payload;
    },
    setSoilsSurfaceAreas: (
      state,
      action: PayloadAction<SiteFoncier["soilsSurfaceAreas"]>,
    ) => {
      state.siteData.soilsSurfaceAreas = action.payload;
    },
    setContaminatedSoilSurface: (state, action: PayloadAction<number>) => {
      state.siteData.contaminatedSoilSurface = action.payload;
    },
    setFullTimeJobsInvolved: (state, action: PayloadAction<number>) => {
      state.siteData.fullTimeJobsInvolved = action.payload;
    },
    setTenant: (state, action: PayloadAction<string>) => {
      state.siteData.tenantBusinessName = action.payload;
    },
    setOwner: (
      state,
      action: PayloadAction<{ type: OwnerType; name?: string }>,
    ) => {
      state.siteData.owner = action.payload;
    },
    setFricheRecentAccidents: (
      state,
      action: PayloadAction<{
        hasRecentAccidents: boolean;
        minorInjuriesPerson?: number;
        severeInjuriesPerson?: number;
        deaths?: number;
      }>,
    ) => {
      const { hasRecentAccidents } = action.payload;
      state.siteData.hasRecentAccidents = action.payload.hasRecentAccidents;

      if (hasRecentAccidents) {
        state.siteData.minorInjuriesPerson =
          action.payload.minorInjuriesPerson ?? 0;
        state.siteData.severeInjuriesPerson =
          action.payload.severeInjuriesPerson ?? 0;
        state.siteData.deaths = action.payload.deaths ?? 0;
      }
    },
    addExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.siteData.yearlyExpenses = [
        ...(state.siteData.yearlyExpenses ?? []),
        ...action.payload,
      ];
    },
    setFricheActivity: (state, action: PayloadAction<FricheActivity>) => {
      state.siteData.fricheActivity = action.payload;
    },
    setNameAndDescription: (
      state,
      action: PayloadAction<{ name: string; description?: string }>,
    ) => {
      state.siteData.name = action.payload.name;
      if (action.payload.description)
        state.siteData.description = action.payload.description;
    },
    goToStep: (state, action: PayloadAction<SiteCreationStep>) => {
      state.step = action.payload;
    },
  },
});

export const {
  setIsFriche,
  setAddress,
  setSurfaceArea,
  setSoils,
  setSoilsSurfaceAreas,
  setContaminatedSoilSurface,
  setOwner,
  setTenant,
  setFullTimeJobsInvolved,
  setFricheRecentAccidents,
  addExpenses,
  setFricheActivity,
  setNameAndDescription,

  goToStep,
} = siteCreationSlice.actions;

export default siteCreationSlice.reducer;
