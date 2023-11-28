import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { saveSiteAction } from "./createSite.actions";

import { FricheActivity } from "@/features/create-site/domain/friche.types";
import {
  Expense,
  SiteDraft,
  SoilType,
} from "@/features/create-site/domain/siteFoncier.types";

export type SiteCreationState = {
  step: SiteCreationStep;
  siteData: Partial<SiteDraft>;
  saveLoadingState: "idle" | "loading" | "success" | "error";
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
  SOILS_CARBON_STORAGE = "SOILS_CARBON_STORAGE",
  // contamination
  SOIL_CONTAMINATION = "SOIL_CONTAMINATION",
  // site management
  MANAGEMENT_INTRODUCTION = "MANAGEMENT_INTRODUCTION",
  OWNER = "OWNER",
  TENANT = "TENANT",
  FULL_TIME_JOBS_INVOLVED = "FULL_TIME_JOBS_INVOLVED",
  RECENT_ACCIDENTS = "RECENT_ACCIDENTS",
  FRICHE_SECURING_EXPENSES = "FRICHE_SECURING_EXPENSES",
  YEARLY_EXPENSES = "YEARLY_EXPENSES",
  SOILS_DEGRADATION_YEARLY_EXPENSES = "SOILS_DEGRADATION_YEARLY_EXPENSES",
  YEARLY_INCOME = "YEARLY_INCOME",
  EXPENSES_SUMMARY = "EXPENSES_SUMMARY",
  // NAMING
  FRICHE_ACTIVITY = "FRICHE_ACTIVITY",
  NAMING = "NAMING",
  CREATION_CONFIRMATION = "CREATION_CONFIRMATION",
}

const getInitialState = (): SiteCreationState => {
  return {
    step: SiteCreationStep.SITE_TYPE,
    saveLoadingState: "idle",
    siteData: {
      id: uuid(),
      soils: [],
      yearlyExpenses: [],
    },
  };
};

export const siteCreationSlice = createSlice({
  name: "siteCreation",
  initialState: getInitialState(),
  reducers: {
    setSurfaceArea: (state, action: PayloadAction<number>) => {
      state.siteData.surfaceArea = action.payload;
    },
    setIsFriche: (state, action: PayloadAction<boolean>) => {
      state.siteData.isFriche = action.payload;
    },
    setAddress: (state, action: PayloadAction<SiteDraft["address"]>) => {
      state.siteData.address = action.payload;
      state.step = SiteCreationStep.SOILS_INTRODUCTION;
    },
    setSoils: (state, action: PayloadAction<SoilType[]>) => {
      state.siteData.soils = action.payload;
    },
    setSoilsSurfaceAreas: (
      state,
      action: PayloadAction<SiteDraft["soilsSurfaceAreas"]>,
    ) => {
      state.siteData.soilsSurfaceAreas = action.payload;
    },
    setContaminatedSoils: (
      state,
      action: PayloadAction<{
        hasContaminatedSoils: boolean;
        contaminatedSoilSurface?: number;
      }>,
    ) => {
      const { hasContaminatedSoils, contaminatedSoilSurface } = action.payload;
      state.siteData.hasContaminatedSoils = hasContaminatedSoils;

      if (hasContaminatedSoils && contaminatedSoilSurface) {
        state.siteData.contaminatedSoilSurface = contaminatedSoilSurface;
      }
    },
    setFullTimeJobsInvolved: (state, action: PayloadAction<number>) => {
      state.siteData.fullTimeJobsInvolved = action.payload;
    },
    setTenant: (state, action: PayloadAction<SiteDraft["tenant"]>) => {
      state.siteData.tenant = action.payload;
    },
    setOwner: (state, action: PayloadAction<SiteDraft["owner"]>) => {
      state.siteData.owner = action.payload;
    },
    setFricheRecentAccidents: (
      state,
      action: PayloadAction<{
        hasRecentAccidents: boolean;
        minorInjuriesPersons?: number;
        severeInjuriesPersons?: number;
        deaths?: number;
      }>,
    ) => {
      const { hasRecentAccidents } = action.payload;
      state.siteData.hasRecentAccidents = action.payload.hasRecentAccidents;

      if (hasRecentAccidents) {
        state.siteData.minorInjuriesPersons =
          action.payload.minorInjuriesPersons ?? 0;
        state.siteData.severeInjuriesPersons =
          action.payload.severeInjuriesPersons ?? 0;
        state.siteData.deaths = action.payload.deaths ?? 0;
      }
    },
    addExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.siteData.yearlyExpenses = [
        ...(state.siteData.yearlyExpenses ?? []),
        ...action.payload,
      ];
    },
    setYearlyIncome: (state, action: PayloadAction<number>) => {
      state.siteData.yearlyIncome = action.payload;
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
  extraReducers(builder) {
    builder.addCase(saveSiteAction.pending, (state) => {
      state.saveLoadingState = "loading";
    });
    builder.addCase(saveSiteAction.fulfilled, (state) => {
      state.saveLoadingState = "success";
    });
    builder.addCase(saveSiteAction.rejected, (state) => {
      state.saveLoadingState = "error";
    });
  },
});

export const {
  setIsFriche,
  setAddress,
  setSurfaceArea,
  setSoils,
  setSoilsSurfaceAreas,
  setContaminatedSoils,
  setOwner,
  setTenant,
  setFullTimeJobsInvolved,
  setFricheRecentAccidents,
  addExpenses,
  setYearlyIncome,
  setFricheActivity,
  setNameAndDescription,

  goToStep,
} = siteCreationSlice.actions;

export default siteCreationSlice.reducer;
