import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { ReadStateHelper } from "../../helpers/readState";
import type { UrbanProjectCreationStep } from "../../urbanProjectSteps";
import type { StepContext } from "../stepHandler.type";

type StepsState = ProjectFormState["urbanProject"]["steps"];
type SiteData = NonNullable<ProjectFormState["siteData"]>;

export function siteHasBuildings(siteData: SiteData): boolean {
  return (siteData.soilsDistribution.BUILDINGS ?? 0) > 0;
}

export function getSiteBuildingsFootprint(siteData: SiteData): number {
  return siteData.soilsDistribution.BUILDINGS ?? 0;
}

export function getProjectBuildingsFootprint(stepsState: StepsState): number {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_SPACES_SURFACE_AREA")
      ?.spacesSurfaceAreaDistribution?.BUILDINGS ?? 0
  );
}

export function getBuildingsFootprintToReuse(stepsState: StepsState): number | undefined {
  return ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
    ?.buildingsFootprintToReuse;
}

export function getBuildingsFootprintToDemolish(
  siteData: SiteData,
  stepsState: StepsState,
): number {
  const reuse = getBuildingsFootprintToReuse(stepsState) ?? 0;
  return getSiteBuildingsFootprint(siteData) - reuse;
}

export function getBuildingsFootprintToConstruct(stepsState: StepsState): number {
  const reuse = getBuildingsFootprintToReuse(stepsState) ?? 0;
  return Math.max(0, getProjectBuildingsFootprint(stepsState) - reuse);
}

export function willDemolishBuildings(siteData: SiteData, stepsState: StepsState): boolean {
  return getBuildingsFootprintToDemolish(siteData, stepsState) > 0;
}

export function willConstructNewBuildings(stepsState: StepsState): boolean {
  return getBuildingsFootprintToConstruct(stepsState) > 0;
}

export function hasBothReuseAndNewConstruction(stepsState: StepsState): boolean {
  const reuse = getBuildingsFootprintToReuse(stepsState) ?? 0;
  return reuse > 0 && willConstructNewBuildings(stepsState);
}

export function getNextStepAfterBuildings(context: StepContext): UrbanProjectCreationStep {
  return context.siteData?.hasContaminatedSoils
    ? "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION"
    : "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
}

export function getLastBuildingsChapterStep(context: StepContext): UrbanProjectCreationStep {
  const { siteData, stepsState } = context;
  if (!siteData || !siteHasBuildings(siteData)) {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION";
  }
  if (hasBothReuseAndNewConstruction(stepsState)) {
    return "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA";
  }
  if (willConstructNewBuildings(stepsState)) {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
  }
  if (willDemolishBuildings(siteData, stepsState)) {
    return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
  }
  return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
}
