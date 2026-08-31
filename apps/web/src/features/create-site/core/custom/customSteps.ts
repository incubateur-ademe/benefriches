import type {
  Address,
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteYearlyExpense,
  SiteYearlyIncome,
  SoilsDistribution,
  SoilType,
  UrbanZoneType,
} from "shared";

import type { WizardFormStepsState } from "@/shared/core/wizard-form/stepHandler.type";

import type { Owner, SiteCreationData, Tenant } from "../siteFoncier.types";

// Info/navigation-only steps — no stored answer, forward-only or terminal.
export const CUSTOM_INFO_STEP_IDS = [
  "SPACES_INTRODUCTION",
  "SOILS_SUMMARY",
  "SOILS_CARBON_STORAGE",
  "SOILS_CONTAMINATION_INTRODUCTION",
  "FRICHE_ACCIDENTS_INTRODUCTION",
  "MANAGEMENT_INTRODUCTION",
  "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
  "YEARLY_EXPENSES_SUMMARY",
  "NAMING_INTRODUCTION",
  "FINAL_SUMMARY",
  "CREATION_RESULT",
  "URBAN_ZONE_LAND_PARCELS_INTRODUCTION",
] as const;

// Answer steps — each stores a payload, keyed the same way as the legacy `*StepCompleted`
// action payloads (see CustomAnswersByStep below).
export const CUSTOM_ANSWER_STEP_IDS = [
  "FRICHE_ACTIVITY",
  "AGRICULTURAL_OPERATION_ACTIVITY",
  "NATURAL_AREA_TYPE",
  "URBAN_ZONE_TYPE",
  "ADDRESS",
  "SURFACE_AREA",
  "SPACES_KNOWLEDGE",
  "SPACES_SELECTION",
  "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
  "SPACES_SURFACE_AREA_DISTRIBUTION",
  "SOILS_CONTAMINATION",
  "FRICHE_ACCIDENTS",
  "OWNER",
  "IS_FRICHE_LEASED",
  "IS_SITE_OPERATED",
  "TENANT",
  "OPERATOR",
  "YEARLY_EXPENSES",
  "YEARLY_INCOME",
  "NAMING",
] as const;

export type CustomInfoStepId = (typeof CUSTOM_INFO_STEP_IDS)[number];
export type CustomAnswerStepId = (typeof CUSTOM_ANSWER_STEP_IDS)[number];

export type SiteCreationCustomStep = CustomInfoStepId | CustomAnswerStepId;

const CUSTOM_STEP_IDS_SET: ReadonlySet<string> = new Set([
  ...CUSTOM_INFO_STEP_IDS,
  ...CUSTOM_ANSWER_STEP_IDS,
]);

export const isCustomStepHandlerStep = (stepId: string): stepId is SiteCreationCustomStep =>
  CUSTOM_STEP_IDS_SET.has(stepId);

/**
 * Per-step stored answer types. Mirrors the raw payload shapes the legacy `*StepCompleted`
 * actions carried (see the deleted `steps/*.actions.ts` files) — not the `SiteCreationData`
 * delta. A handful of steps carry extra optional fields beyond the raw form submission: those
 * are filled in by the step's own `updateAnswersMiddleware` (auto-filled soils distribution,
 * splitEvenly fallback, ...) so the stored payload ends up complete, without the view ever
 * having to compute them.
 */
export type CustomAnswersByStep = {
  FRICHE_ACTIVITY: FricheActivity;
  AGRICULTURAL_OPERATION_ACTIVITY: { activity: AgriculturalOperationActivity };
  NATURAL_AREA_TYPE: { naturalAreaType: NaturalAreaType };
  URBAN_ZONE_TYPE: { urbanZoneType: UrbanZoneType };
  ADDRESS: { address: Address };
  SURFACE_AREA: { surfaceArea: number };
  SPACES_KNOWLEDGE: {
    knowsSpaces: boolean;
    // Filled in by updateAnswersMiddleware when knowsSpaces is false.
    soilsDistribution?: SoilsDistribution;
    soils?: SoilType[];
  };
  SPACES_SELECTION: {
    soils: SoilType[];
    // Filled in by updateAnswersMiddleware when a single soil type is selected.
    soilsDistribution?: SoilsDistribution;
  };
  SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE: {
    knowsSurfaceAreas: boolean;
    // Filled in by updateAnswersMiddleware when knowsSurfaceAreas is false.
    soilsDistribution?: SoilsDistribution;
  };
  SPACES_SURFACE_AREA_DISTRIBUTION: { distribution: SoilsDistribution };
  SOILS_CONTAMINATION: { hasContaminatedSoils: boolean; contaminatedSoilSurface?: number };
  FRICHE_ACCIDENTS:
    | { hasRecentAccidents: false }
    | {
        hasRecentAccidents: true;
        accidentsMinorInjuries?: number;
        accidentsSevereInjuries?: number;
        accidentsDeaths?: number;
      };
  OWNER: { owner: Owner };
  IS_FRICHE_LEASED: { isFricheLeased: boolean };
  IS_SITE_OPERATED: { isSiteOperated: boolean };
  TENANT: { tenant: Tenant | undefined };
  OPERATOR: { tenant: Tenant | undefined };
  YEARLY_EXPENSES: SiteYearlyExpense[];
  YEARLY_INCOME: SiteYearlyIncome[];
  NAMING: { name: string; description?: string };
};

export type CustomStepsState = WizardFormStepsState<CustomAnswersByStep>;

/**
 * Folds the per-step answers stored by the wizard-form engine back into a `SiteCreationData`,
 * starting from the flow's initial site data (id + defaults, plus whatever the pre-engine steps
 * — IS_FRICHE/SITE_NATURE — already set) and applying each completed step's own delta mapping.
 * Direct, minimally-adapted descendant of ticket 05's `deriveSiteDataFromAnswers`: still a
 * simple, provably-total fold — the only addition is the per-step raw-answer -> delta mapping
 * below, made necessary because the stored payloads mirror the legacy action payloads (not a
 * pre-shaped `SiteCreationData` delta).
 */
export const deriveSiteDataFromCustomSteps = (
  initialSiteData: SiteCreationData,
  steps: CustomStepsState,
): SiteCreationData => {
  let siteData = initialSiteData;

  const friche = steps.FRICHE_ACTIVITY;
  if (friche?.completed && friche.payload !== undefined) {
    siteData = { ...siteData, fricheActivity: friche.payload };
  }

  const agriculturalOperation = steps.AGRICULTURAL_OPERATION_ACTIVITY;
  if (agriculturalOperation?.completed && agriculturalOperation.payload) {
    siteData = {
      ...siteData,
      agriculturalOperationActivity: agriculturalOperation.payload.activity,
    };
  }

  const naturalAreaType = steps.NATURAL_AREA_TYPE;
  if (naturalAreaType?.completed && naturalAreaType.payload) {
    siteData = { ...siteData, naturalAreaType: naturalAreaType.payload.naturalAreaType };
  }

  const urbanZoneType = steps.URBAN_ZONE_TYPE;
  if (urbanZoneType?.completed && urbanZoneType.payload) {
    siteData = { ...siteData, urbanZoneType: urbanZoneType.payload.urbanZoneType };
  }

  const address = steps.ADDRESS;
  if (address?.completed && address.payload) {
    siteData = { ...siteData, address: address.payload.address };
  }

  const surfaceArea = steps.SURFACE_AREA;
  if (surfaceArea?.completed && surfaceArea.payload) {
    siteData = { ...siteData, surfaceArea: surfaceArea.payload.surfaceArea };
  }

  const spacesKnowledge = steps.SPACES_KNOWLEDGE;
  if (spacesKnowledge?.completed && spacesKnowledge.payload) {
    siteData = {
      ...siteData,
      spacesDistributionKnowledge: spacesKnowledge.payload.knowsSpaces,
      ...(spacesKnowledge.payload.soilsDistribution !== undefined && {
        soilsDistribution: spacesKnowledge.payload.soilsDistribution,
      }),
      ...(spacesKnowledge.payload.soils !== undefined && { soils: spacesKnowledge.payload.soils }),
    };
  }

  const spacesSelection = steps.SPACES_SELECTION;
  if (spacesSelection?.completed && spacesSelection.payload) {
    siteData = {
      ...siteData,
      soils: spacesSelection.payload.soils,
      ...(spacesSelection.payload.soilsDistribution !== undefined && {
        soilsDistribution: spacesSelection.payload.soilsDistribution,
      }),
    };
  }

  const distributionKnowledge = steps.SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE;
  if (distributionKnowledge?.completed && distributionKnowledge.payload) {
    siteData = {
      ...siteData,
      spacesDistributionKnowledge: distributionKnowledge.payload.knowsSurfaceAreas,
      ...(distributionKnowledge.payload.soilsDistribution !== undefined && {
        soilsDistribution: distributionKnowledge.payload.soilsDistribution,
      }),
    };
  }

  const distribution = steps.SPACES_SURFACE_AREA_DISTRIBUTION;
  if (distribution?.completed && distribution.payload) {
    siteData = { ...siteData, soilsDistribution: distribution.payload.distribution };
  }

  const contamination = steps.SOILS_CONTAMINATION;
  if (contamination?.completed && contamination.payload) {
    siteData = {
      ...siteData,
      hasContaminatedSoils: contamination.payload.hasContaminatedSoils,
      ...(contamination.payload.hasContaminatedSoils &&
        contamination.payload.contaminatedSoilSurface !== undefined && {
          contaminatedSoilSurface: contamination.payload.contaminatedSoilSurface,
        }),
    };
  }

  const accidents = steps.FRICHE_ACCIDENTS;
  if (accidents?.completed && accidents.payload) {
    siteData = {
      ...siteData,
      hasRecentAccidents: accidents.payload.hasRecentAccidents,
      ...(accidents.payload.hasRecentAccidents && {
        accidentsMinorInjuries: accidents.payload.accidentsMinorInjuries ?? 0,
        accidentsSevereInjuries: accidents.payload.accidentsSevereInjuries ?? 0,
        accidentsDeaths: accidents.payload.accidentsDeaths ?? 0,
      }),
    };
  }

  const owner = steps.OWNER;
  if (owner?.completed && owner.payload) {
    siteData = { ...siteData, owner: owner.payload.owner };
  }

  const isFricheLeased = steps.IS_FRICHE_LEASED;
  if (isFricheLeased?.completed && isFricheLeased.payload) {
    siteData = { ...siteData, isFricheLeased: isFricheLeased.payload.isFricheLeased };
  }

  const isSiteOperated = steps.IS_SITE_OPERATED;
  if (isSiteOperated?.completed && isSiteOperated.payload) {
    siteData = { ...siteData, isSiteOperated: isSiteOperated.payload.isSiteOperated };
  }

  const tenant = steps.TENANT;
  if (tenant?.completed && tenant.payload) {
    siteData = { ...siteData, tenant: tenant.payload.tenant };
  }

  const operator = steps.OPERATOR;
  if (operator?.completed && operator.payload?.tenant) {
    siteData = { ...siteData, tenant: operator.payload.tenant };
  }

  const yearlyExpenses = steps.YEARLY_EXPENSES;
  if (yearlyExpenses?.completed && yearlyExpenses.payload) {
    siteData = { ...siteData, yearlyExpenses: yearlyExpenses.payload };
  }

  const yearlyIncome = steps.YEARLY_INCOME;
  if (yearlyIncome?.completed && yearlyIncome.payload) {
    siteData = { ...siteData, yearlyIncomes: yearlyIncome.payload };
  }

  const naming = steps.NAMING;
  if (naming?.completed && naming.payload) {
    siteData = {
      ...siteData,
      name: naming.payload.name,
      ...(naming.payload.description && { description: naming.payload.description }),
    };
  }

  return siteData;
};
