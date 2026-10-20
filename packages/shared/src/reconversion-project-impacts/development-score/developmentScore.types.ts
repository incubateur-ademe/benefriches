import type { BuildingsUseDistribution } from "../../reconversion-projects";
import type { SiteNature } from "../../site";
import type { SoilType } from "../../soils";
import type { AggregatedReconversionProjectOnSiteImpactItemView } from "../projectImpacts.types";

export type LetterGrade = "A" | "B" | "C" | "D" | "E";
export type LetterGradeWithModifier = LetterGrade | `${LetterGrade}+` | `${LetterGrade}-`;
export type MainScore = {
  letterGrade: LetterGrade;
  letterGradeWithModifiers: LetterGradeWithModifier;
  gradePoints: number;
};

type WithFamilyScore<TDetails> = {
  score: MainScore;
  indicators: TDetails;
};

export type IndicatorRole = "core" | "bonus";
export type WithRequiredIndicatorScore<TMetrics> = {
  role: IndicatorRole;
  applies: true;
  letterGrade: LetterGrade;
  gradePoints: number;
  metrics: TMetrics;
};

export type WithNullableIndicatorScore<TMetrics> =
  | {
      applies: boolean;
      role?: IndicatorRole;
      letterGrade?: LetterGrade;
      gradePoints: number;
      metrics?: TMetrics;
    }
  | WithRequiredIndicatorScore<TMetrics>;

/* Metrics type */
export type SoilEvolutionDetails = {
  soilsDistribution: { soilType: SoilType; total: number }[];
  permeableSurfaceDifference: { difference: number; percentVariation: number };
  contamination: { siteContaminatedSurface: number; difference: number; percentVariation: number };
  newGreenSoilSurfaces: number;
};
export type SiteReconversionType = "friche" | "enaf" | "friche_agricole" | undefined;

export type BuildingUseSurface = {
  buildingUse: keyof BuildingsUseDistribution;
  floorSurfaceArea: number;
};
export type LivingEnvironmentContext = {
  siteNature: SiteNature;
  projectDevelopmentPlanType:
    | "SUBURBAN_DENSIFICATION"
    | "GRAND_ENSEMBLE"
    | "ZAE_TRANSFORMATION"
    | "URBAN_PROJECT"
    | "PHOTOVOLTAIC_POWER_PLANT";
  siteReconversionType: SiteReconversionType;
  buildingsFloorAreaDistribution: BuildingsUseDistribution | undefined;
  soilEvolutionDetails: Pick<SoilEvolutionDetails, "newGreenSoilSurfaces">;
};

/* Indicator metrics */

export type FullTimeJobsIndicatorMetrics = {
  siteSurfaceArea: number;
  fullTimeJobsDifferenceByHectare: number;
  siteStatuQuoFullTimeJobs: number;
  difference: number;
};

export type LivingEnvironmentIndicatorMetrics = LivingEnvironmentContext;
export type LocalHealthinessIndicatorMetrics = {
  siteReconversionType: SiteReconversionType;
  sportsFacilitiesFloorSurface: number;
  newGreenSoilSurfaces: number;
};
export type AccessToLocalServicesIndicatorMetrics = {
  matchingBuildingsUses: BuildingUseSurface[];
};
export type AccessToHealthCareIndicatorMetrics = {
  matchingBuildingsUses: BuildingUseSurface[];
};
export type TrafficSecurityIndicatorMetrics = {
  avoidedTrafficAccidents: number;
};
export type FricheAccidentsIndicatorMetrics = {
  avoidedFricheAccidents: number;
};

export type LocalAuthorityFinancesIndicatorMetrics = {
  projectLocalAuthorityIndirectEconomicImpactsTotal: number;
  municipalityCapitalExpendituresAmount: number;
  municipalityCapitalExpendituresReferenceYear: string;
  percentageComparison: number;
};

export type Co2eqEmissionsVariationIndicatorMetrics = {
  avoidedCo2eqEmissions: number;
  newStoredCo2Eq: number;
  siteStatuQuoStoredCo2Eq: number;
  soilStoredPercentageVariation: number;
};
export type ZanComplianceIndicatorMetrics = Pick<
  SoilEvolutionDetails,
  "newGreenSoilSurfaces" | "permeableSurfaceDifference"
> & {
  siteReconversionType: SiteReconversionType;
};
export type SoilsQualityIndicatorMetrics = Pick<
  SoilEvolutionDetails,
  "permeableSurfaceDifference" | "contamination"
>;
export type WaterQualityIndicatorMetrics = Pick<SoilEvolutionDetails, "contamination"> & {
  prairieSurfaceDifference: number;
  forestSurfaceDifference: number;
  agriculturalSurfaceDifference: number;
  wetLandSurfaceDifference: number;
};
export type EcosystemServicesIndicatorMetrics = {
  ecosystemicServices: AggregatedReconversionProjectOnSiteImpactItemView[];
};

/* Main Type */
export type ProjectDevelopmentScore = {
  score: {
    letterGrade: LetterGrade;
    letterGradeWithModifiers: LetterGradeWithModifier;
    gradePoints: number;
  };
  details: {
    fullTimeJobsScore: WithFamilyScore<{
      fullTimeJobs: WithRequiredIndicatorScore<FullTimeJobsIndicatorMetrics>;
    }>;
    localPeopleQualityOfLifeScore: WithFamilyScore<{
      livingEnvironment: WithRequiredIndicatorScore<LivingEnvironmentIndicatorMetrics>;
      localHealthiness: WithNullableIndicatorScore<LocalHealthinessIndicatorMetrics>;
      trafficSecurity: WithNullableIndicatorScore<TrafficSecurityIndicatorMetrics>;
      fricheAccidents: WithNullableIndicatorScore<FricheAccidentsIndicatorMetrics>;
      accessToLocalServices: WithNullableIndicatorScore<AccessToLocalServicesIndicatorMetrics>;
      accessToHealthCare: WithNullableIndicatorScore<AccessToHealthCareIndicatorMetrics>;
    }>;
    localAuthorityEconomicScore: WithFamilyScore<{
      localAuthorityFinances: WithRequiredIndicatorScore<LocalAuthorityFinancesIndicatorMetrics>;
    }>;
    environmentScore: WithFamilyScore<{
      co2eqEmissionsVariation: WithRequiredIndicatorScore<Co2eqEmissionsVariationIndicatorMetrics>;
      zanCompliance: WithNullableIndicatorScore<ZanComplianceIndicatorMetrics>;
      soilsQuality: WithRequiredIndicatorScore<SoilsQualityIndicatorMetrics>;
      waterQuality: WithRequiredIndicatorScore<WaterQualityIndicatorMetrics>;
      ecosystemServices: WithRequiredIndicatorScore<EcosystemServicesIndicatorMetrics>;
    }>;
  };
};
