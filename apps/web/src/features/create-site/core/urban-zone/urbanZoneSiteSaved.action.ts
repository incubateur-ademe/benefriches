import type { CreateCustomSiteDto, UrbanZoneLandParcel, UrbanZoneLandParcelType } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import {
  customSiteSchema,
  type CustomSitePayload,
} from "@/features/create-site/core/createSiteGateway";
import type { SiteCreationData } from "@/features/create-site/core/siteFoncier.types";

import { ReadStateHelper, getSelectedParcelTypes } from "./stateHelpers";
import { getExpensesAndIncomeSummaryViewData } from "./steps/expenses/expenses-summary/expensesAndIncomeSummary.selectors";
import { getManagerName } from "./steps/management/managementReaders";
import { getParcelStepIds } from "./steps/per-parcel-soils/parcelStepMapping";
import { makeUrbanZoneActionType } from "./urban-zone.actions";
import type { UrbanZoneStepsState } from "./urbanZoneSteps";

type UrbanZoneCustomSitePayload = Extract<CreateCustomSiteDto, { nature: "URBAN_ZONE" }>;
type UrbanZoneSiteDataForSave = {
  id: SiteCreationData["id"];
  nature: "URBAN_ZONE";
  address: SiteCreationData["address"];
  owner: SiteCreationData["owner"];
  tenant: SiteCreationData["tenant"];
  yearlyExpenses: UrbanZoneCustomSitePayload["yearlyExpenses"];
  yearlyIncomes: UrbanZoneCustomSitePayload["yearlyIncomes"];
  name: string | undefined;
  description: string | undefined;
  urbanZoneType: SiteCreationData["urbanZoneType"];
  landParcels: UrbanZoneCustomSitePayload["landParcels"];
  hasContaminatedSoils: boolean | undefined;
  contaminatedSoilSurface: number | undefined;
  manager:
    | {
        structureType: string;
        name: string | undefined;
      }
    | undefined;
  vacantCommercialPremisesFootprint: number | undefined;
  vacantCommercialPremisesFloorArea: number | undefined;
  fullTimeJobsEquivalent: number | undefined;
};

const ACTIVITY_PARK_MANAGER_NAME = "Gestionnaire de parc d'activité";

const getRequiredParcelSurfaceArea = (
  surfaceAreas: Partial<Record<UrbanZoneLandParcelType, number>>,
  parcelType: UrbanZoneLandParcelType,
): number => {
  const surfaceArea = surfaceAreas[parcelType];

  if (surfaceArea === undefined) {
    throw new Error(`Missing surface area for land parcel ${parcelType}`);
  }

  return surfaceArea;
};

const getUrbanZoneLandParcels = (
  steps: UrbanZoneStepsState,
): UrbanZoneCustomSitePayload["landParcels"] => {
  const surfaceAreas =
    ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION")
      ?.surfaceAreas ?? {};

  return getSelectedParcelTypes(steps).map((parcelType) => {
    const { soilsDistribution: soilsStepId, buildingsFloorArea: floorAreaStepId } =
      getParcelStepIds(parcelType);
    const soilsDistribution = ReadStateHelper.getStepAnswers(steps, soilsStepId)?.soilsDistribution;
    const buildingsFloorSurfaceArea = ReadStateHelper.getStepAnswers(
      steps,
      floorAreaStepId,
    )?.buildingsFloorSurfaceArea;

    return {
      type: parcelType,
      surfaceArea: getRequiredParcelSurfaceArea(surfaceAreas, parcelType),
      soilsDistribution: soilsDistribution ?? {},
      ...(buildingsFloorSurfaceArea !== undefined && { buildingsFloorSurfaceArea }),
    } satisfies UrbanZoneLandParcel;
  });
};

const buildUrbanZoneSiteDataForSave = (
  siteData: SiteCreationData,
  steps: UrbanZoneStepsState,
): UrbanZoneSiteDataForSave => {
  const { expenses, incomes } = getExpensesAndIncomeSummaryViewData(steps);
  const contamination = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_SOILS_CONTAMINATION");
  const manager = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_MANAGER");
  const vacantCommercialPremisesFootprint = ReadStateHelper.getStepAnswers(
    steps,
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
  );
  const vacantCommercialPremisesFloorArea = ReadStateHelper.getStepAnswers(
    steps,
    "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
  );
  const fullTimeJobsEquivalent = ReadStateHelper.getStepAnswers(
    steps,
    "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
  );
  const naming = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_NAMING");

  return {
    id: siteData.id,
    nature: "URBAN_ZONE",
    address: siteData.address,
    owner: siteData.owner,
    tenant: siteData.tenant,
    yearlyExpenses: expenses,
    yearlyIncomes: incomes,
    name: naming?.name,
    description: naming?.description,
    urbanZoneType: siteData.urbanZoneType,
    landParcels: getUrbanZoneLandParcels(steps),
    hasContaminatedSoils: contamination?.hasContaminatedSoils,
    contaminatedSoilSurface: contamination?.contaminatedSoilSurface,
    manager: manager
      ? {
          structureType: manager.structureType,
          name:
            getManagerName(steps) ??
            (manager.structureType === "activity_park_manager"
              ? ACTIVITY_PARK_MANAGER_NAME
              : undefined),
        }
      : undefined,
    vacantCommercialPremisesFootprint: vacantCommercialPremisesFootprint?.surfaceArea,
    vacantCommercialPremisesFloorArea: vacantCommercialPremisesFloorArea?.surfaceArea,
    fullTimeJobsEquivalent: fullTimeJobsEquivalent?.fullTimeJobs,
  };
};

export const urbanZoneSiteSaved = createAppAsyncThunk(
  makeUrbanZoneActionType("saved"),
  async (_, { getState, extra }) => {
    const { siteCreation, currentUser } = getState();
    const { siteData, urbanZone } = siteCreation;

    const siteToCreate: CustomSitePayload = customSiteSchema.parse({
      createdBy: currentUser.currentUser?.id,
      ...buildUrbanZoneSiteDataForSave(siteData, urbanZone.steps),
    });

    await extra.createSiteService.saveCustom(siteToCreate);
  },
);
