import type { BuildingsUseDistribution } from "../../reconversion-projects";
import type { SiteNature } from "../../site";
import type { SoilType } from "../../soils";
import type { AggregatedReconversionProjectOnSiteImpactItemView } from "../projectImpacts.types";

export type LetterGrade = "A" | "B" | "C" | "D" | "E";
export type LetterGradeWithModifier = LetterGrade | `${LetterGrade}+` | `${LetterGrade}-`;

export type Score = {
  letterGrade: LetterGrade;
  letterGradeWithModifiers: LetterGradeWithModifier;
  gradePoints: number;
};

type ScoredWithModifiers<TDetails> = {
  score: Score;
  details: TDetails;
};
export type ScoredIndicator<TMetrics> = { letterGrade: LetterGrade; metrics: TMetrics } | undefined;

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

/* Indicator type */

export type FullTimeJobsIndicator = ScoredIndicator<{
  fullTimeJobsDifferenceByHectare: number;
  siteStatuQuoFullTimeJobs: number;
  difference: number;
}>;

export type LivingEnvironmentIndicator = ScoredIndicator<LivingEnvironmentContext>;
export type LocalHealthinessIndicator = ScoredIndicator<{
  siteReconversionType: SiteReconversionType;
  sportsFacilitiesFloorSurface: number;
  newGreenSoilSurfaces: number;
}>;
export type AccessToLocalServicesIndicator = ScoredIndicator<{
  matchingBuildingsUses: BuildingUseSurface[];
}>;
export type AccessToHealthCareIndicator = ScoredIndicator<{
  matchingBuildingsUses: BuildingUseSurface[];
}>;
export type TrafficSecurityIndicator = ScoredIndicator<{
  avoidedTrafficAccidents: number;
}>;
export type FricheAccidentsIndicator = ScoredIndicator<{
  avoidedFricheAccidents: number;
}>;

export type LocalAuthorityFinancesIndicator = ScoredIndicator<{
  projectLocalAuthorityIndirectEconomicImpactsTotal: number;
  municipalityCapitalExpendituresAmount: number;
  municipalityCapitalExpendituresReferenceYear: string;
  percentageComparison: number;
}>;

export type Co2eqEmissionsVariationIndicator = ScoredIndicator<{
  avoidedCo2eqEmissions: number;
  newStoredCo2Eq: number;
  siteStatuQuoStoredCo2Eq: number;
  soilStoredPercentageVariation: number;
}>;
export type ZanComplianceIndicator = ScoredIndicator<
  Pick<SoilEvolutionDetails, "newGreenSoilSurfaces" | "permeableSurfaceDifference"> & {
    siteReconversionType: SiteReconversionType;
  }
>;
export type SoilsQualityIndicator = ScoredIndicator<
  Pick<SoilEvolutionDetails, "permeableSurfaceDifference" | "contamination">
>;
export type WaterQualityIndicator = ScoredIndicator<
  Pick<SoilEvolutionDetails, "contamination"> & {
    prairieSurfaceDifference: number;
    forestSurfaceDifference: number;
    agriculturalSurfaceDifference: number;
    wetLandSurfaceDifference: number;
  }
>;
export type EcosystemServicesIndicator = ScoredIndicator<{
  ecosystemicServices: AggregatedReconversionProjectOnSiteImpactItemView[];
}>;

/* Main Type */
export type ProjectDevelopmentScore = {
  score: Score;
  details: {
    fullTimeJobsScore: ScoredWithModifiers<{
      fullTimeJobs: FullTimeJobsIndicator;
    }>;
    localPeopleQualityOfLifeScore: ScoredWithModifiers<
      | {
          livingEnvironment: LivingEnvironmentIndicator;
          localHealthiness: LocalHealthinessIndicator;
          accessToLocalServices: AccessToLocalServicesIndicator;
          accessToHealthCare: AccessToHealthCareIndicator;
          trafficSecurity: TrafficSecurityIndicator;
          fricheAccidents: FricheAccidentsIndicator;
        }
      | {
          livingEnvironment: LivingEnvironmentIndicator;
          fricheAccidents: FricheAccidentsIndicator;
        }
    >;
    localAuthorityEconomicScore: ScoredWithModifiers<{
      localAuthorityFinances: LocalAuthorityFinancesIndicator;
    }>;
    environmentScore: ScoredWithModifiers<{
      co2eqEmissionsVariation: Co2eqEmissionsVariationIndicator;
      zanCompliance: ZanComplianceIndicator;
      soilsQuality: SoilsQualityIndicator;
      waterQuality: WaterQualityIndicator;
      ecosystemServices: EcosystemServicesIndicator;
    }>;
  };
};
