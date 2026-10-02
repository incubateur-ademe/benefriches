import type { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import { roundTo2Digits, sumList } from "../../services";
import type { AggregatedReconversionProjectOnSiteImpactItemView } from "../projectImpacts.types";
import { getAvoidedCo2EmissionsScore } from "./environment/co2EqEmissions.score";
import { getEcosystemServicesScore } from "./environment/ecosystemServices.score";
import { getSoilsQualityScore } from "./environment/soilsQuality.score";
import { getWaterQualityScore } from "./environment/waterQuality.score";
import { getZanComplianceScore } from "./environment/zanCompliance.score";
import { getFullTimeJobsScore } from "./jobs/fullTimeJobs.score";
import { getLocalAuthorityFinancesScore } from "./local-authority-finances/localAuthorityFinances.score";
import { getAccessToHealthCareScore } from "./local-people-quality-of-life/accessToHealthCare.score";
import { getAccessToLocalServicesScore } from "./local-people-quality-of-life/accessToLocalStore.score";
import { getFricheAccidentsScore } from "./local-people-quality-of-life/fricheAccidents.score";
import { getLivingEnvironmentScore } from "./local-people-quality-of-life/livingEnvironment.score";
import { getLocalHealthinessScore } from "./local-people-quality-of-life/localHealthiness.score";
import { getTrafficSecurityScore } from "./local-people-quality-of-life/trafficSecurity.score";
import {
  type BuildingUseSurface,
  getSiteReconversionType,
  getSoilEvolutionDetails,
  type SiteReconversionType,
  type SoilEvolutionDetails,
} from "./readFeatures.helpers";
import {
  computeSectionScore,
  computeScoreFromGradePoints,
  type ScoredMetrics,
  type Score,
} from "./scoring.helpers";

export const computeProjectDevelopmentScore = (
  contextData: GetReconversionProjectImpactsResultDto["contextData"],
  impacts: Omit<GetReconversionProjectImpactsResultDto["impacts"], "developmentScore">,
): ProjectDevelopmentScore => {
  const soilsEvolutionDetails = getSoilEvolutionDetails({
    siteStatuQuoImpactMetrics: impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics,
    aggregatedReconversionImpactMetrics: impacts.aggregatedReconversionImpacts.impactsMetrics,
  });
  const siteReconversionType = getSiteReconversionType(contextData);
  const projectDevelopmentPlanType = contextData.projectDevelopmentPlan.type;

  const { aggregatedReconversionImpacts, reconversionImpactsBreakdown } = impacts;

  const environmentScore = computeSectionScore({
    co2eqEmissionsVariation: getAvoidedCo2EmissionsScore({
      projectDevelopmentPlanType: projectDevelopmentPlanType,
      aggregatedReconversionImpactMetrics: aggregatedReconversionImpacts.impactsMetrics,
      siteStatuQuoImpactMetrics: reconversionImpactsBreakdown.siteStatuQuoImpactMetrics,
    }),
    zanCompliance: getZanComplianceScore(siteReconversionType, soilsEvolutionDetails),
    soilsQuality: getSoilsQualityScore(soilsEvolutionDetails),
    waterQuality: getWaterQualityScore(soilsEvolutionDetails),
    ecosystemServices: getEcosystemServicesScore(
      aggregatedReconversionImpacts.indirectEconomicImpacts.details,
    ),
  });

  const fullTimeJobsScore = computeSectionScore({
    fullTimeJobs: getFullTimeJobsScore({
      aggregatedReconversionImpactMetrics: impacts.aggregatedReconversionImpacts.impactsMetrics,
      siteSurfaceArea: contextData.siteSurfaceArea,
    }),
  });

  const localAuthorityEconomicScore = computeSectionScore({
    localAuthorityFinances: getLocalAuthorityFinancesScore({
      aggregatedReconversionEconomicImpacts:
        impacts.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
      stakeholders: impacts.stakeholders,
      municipalityCapitalExpenditures: contextData.municipalityCapitalExpenditures,
    }),
  });

  const buildingsFloorAreaEvolution =
    projectDevelopmentPlanType === "URBAN_PROJECT"
      ? contextData.projectDevelopmentPlan.buildingsFloorAreaDistribution
      : undefined;

  const localPeopleQualityOfLifeScore = computeSectionScore({
    livingEnvironment: getLivingEnvironmentScore(siteReconversionType),
    localHealthiness: getLocalHealthinessScore({
      siteReconversionType: siteReconversionType,
      soilEvolutionDetails: soilsEvolutionDetails,
      buildingsFloorAreaDistribution: buildingsFloorAreaEvolution,
    }),
    accessToLocalServices: getAccessToLocalServicesScore(buildingsFloorAreaEvolution),
    accessToHealthCare: getAccessToHealthCareScore(buildingsFloorAreaEvolution),
    trafficSecurity: getTrafficSecurityScore(aggregatedReconversionImpacts.impactsMetrics),
    frichesAccidents: getFricheAccidentsScore(aggregatedReconversionImpacts.impactsMetrics),
  });

  const scores = [
    localAuthorityEconomicScore.score.gradePoints,
    environmentScore.score.gradePoints,
    fullTimeJobsScore.score.gradePoints,
    localPeopleQualityOfLifeScore.score.gradePoints,
  ];

  return {
    score: computeScoreFromGradePoints(roundTo2Digits(sumList(scores) / scores.length)),
    details: {
      environmentScore,
      fullTimeJobsScore,
      localPeopleQualityOfLifeScore,
      localAuthorityEconomicScore,
    },
  };
};

export type ProjectDevelopmentScore = {
  score: Score;
  details: {
    fullTimeJobsScore: {
      score: Score;
      details: {
        fullTimeJobs: ScoredMetrics<{
          fullTimeJobsDifferenceByHectare: number;
          siteStatuQuoFullTimeJobs: number;
          difference: number;
        }>;
      };
    };
    localPeopleQualityOfLifeScore: {
      score: Score;
      details: {
        livingEnvironment: ScoredMetrics<{
          siteReconversionType: SiteReconversionType;
        }>;
        localHealthiness: ScoredMetrics<{
          siteReconversionType: SiteReconversionType;
          sportsFacilitiesFloorSurface: number;
          newGreenSoilSurfaces: number;
        }>;
        accessToLocalServices: ScoredMetrics<{
          matchingBuildingsUses: BuildingUseSurface[];
        }>;
        accessToHealthCare: ScoredMetrics<{
          matchingBuildingsUses: BuildingUseSurface[];
        }>;
        trafficSecurity: ScoredMetrics<{
          avoidedTrafficAccidents: number;
        }>;
        frichesAccidents: ScoredMetrics<{
          avoidedFricheAccidents: number;
        }>;
      };
    };
    localAuthorityEconomicScore: {
      score: Score;
      details: {
        localAuthorityFinances: ScoredMetrics<{
          projectLocalAuthorityIndirectEconomicImpactsTotal: number;
          municipalityCapitalExpendituresAmount: number;
          municipalityCapitalExpendituresReferenceYear: string;
          percentageComparison: number;
        }>;
      };
    };
    environmentScore: {
      score: Score;
      details: {
        co2eqEmissionsVariation: ScoredMetrics<{
          avoidedCo2eqEmissions: number;
          newStoredCo2Eq: number;
          siteStatuQuoStoredCo2Eq: number;
          soilStoredPercentageVariation: number;
        }>;
        zanCompliance: ScoredMetrics<
          Pick<SoilEvolutionDetails, "newGreenSoilSurfaces" | "permeableSurfaceDifference"> & {
            siteReconversionType: SiteReconversionType;
          }
        >;
        soilsQuality: ScoredMetrics<
          Pick<SoilEvolutionDetails, "permeableSurfaceDifference" | "contamination">
        >;
        waterQuality: ScoredMetrics<
          Pick<SoilEvolutionDetails, "contamination"> & {
            prairieSurfaceDifference: number;
            forestSurfaceDifference: number;
            agriculturalSurfaceDifference: number;
            wetLandSurfaceDifference: number;
          }
        >;
        ecosystemServices: ScoredMetrics<{
          ecosystemicServices: AggregatedReconversionProjectOnSiteImpactItemView[];
        }>;
      };
    };
  };
};
