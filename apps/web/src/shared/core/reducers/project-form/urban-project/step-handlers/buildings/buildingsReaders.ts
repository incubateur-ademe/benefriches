import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { willHaveBuildings } from "@/shared/core/reducers/project-form/urban-project/helpers/readers/buildingsReaders";

import { ReadStateHelper } from "../../helpers/readState";
import type { UrbanProjectCreationStep } from "../../urbanProjectSteps";
import type { StepContext } from "../stepHandler.type";

type StepsState = ProjectFormState["urbanProject"]["steps"];
type SiteData = NonNullable<ProjectFormState["siteData"]>;

export function siteHasBuildings(siteData: SiteData): boolean {
  return getSiteBuildingsFootprint(siteData) > 0;
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

export function willReuseExistingBuildings(stepsState: StepsState): boolean {
  return (getBuildingsFootprintToReuse(stepsState) ?? 0) > 0;
}

export function hasBothReuseAndNewConstruction(stepsState: StepsState): boolean {
  return willReuseExistingBuildings(stepsState) && willConstructNewBuildings(stepsState);
}

function hasNewBuildingsUsesFloorSurfaceAreaStep(stepsState: StepsState): boolean {
  return Boolean(
    ReadStateHelper.getStep(
      stepsState,
      "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
    ),
  );
}

export function shouldRouteToNewBuildingsUsesFloorSurfaceArea(stepsState: StepsState): boolean {
  return (
    willConstructNewBuildings(stepsState) &&
    (hasBothReuseAndNewConstruction(stepsState) ||
      hasNewBuildingsUsesFloorSurfaceAreaStep(stepsState))
  );
}

export function getNextStepAfterBuildings(context: StepContext): UrbanProjectCreationStep {
  return context.siteData?.hasContaminatedSoils
    ? "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION"
    : "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
}

export function shouldEnterBuildingsChapter(context: StepContext): boolean {
  const willProjectHaveBuildings = willHaveBuildings(context.stepsState);
  const hasSiteBuildings = context.siteData ? siteHasBuildings(context.siteData) : false;

  return willProjectHaveBuildings || hasSiteBuildings;
}

export function getLastBuildingsChapterStep(context: StepContext): UrbanProjectCreationStep {
  const { siteData, stepsState } = context;
  if (!siteData || !siteHasBuildings(siteData)) {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION";
  }
  if (shouldRouteToNewBuildingsUsesFloorSurfaceArea(stepsState)) {
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
