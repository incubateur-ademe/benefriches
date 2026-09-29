import type { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import { roundTo2Digits, sumList } from "../../services";
import type { AggregatedReconversionProjectOnSiteImpactItemView } from "../projectImpacts.types";
import { getAvoidedCo2EmissionsScore } from "./environment/co2EqEmissions.score";
import { getEcosystemServicesScore } from "./environment/ecosystemServices.score";
import { getSoilsQualityScore } from "./environment/soilsQuality.score";
import { getWaterQualityLetterScore } from "./environment/waterQuality.score";
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
  convertNumberScoreToLetterScore,
  type ItemScoreResult,
  type LetterGrade,
} from "./scoring.helpers";

export const computeProjectDevelopmentScore = (
  contextData: GetReconversionProjectImpactsResultDto["contextData"],
  impacts: GetReconversionProjectImpactsResultDto["impacts"],
): ProjectDevelopmentScore => {
  const soilsEvolutionDetails = getSoilEvolutionDetails({
    siteStatuQuoImpactMetrics: impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics,
    aggregatedReconversionImpactMetrics: impacts.aggregatedReconversionImpacts.impactsMetrics,
  });
  const siteReconversionType = getSiteReconversionType(contextData);
  const projectDevelopmentPlanType = contextData.projectDevelopmentPlan.type;

  const { aggregatedReconversionImpacts, reconversionImpactsBreakdown } = impacts;

  const environmentScore = computeSectionScore({
    avoidedCo2Emissions: getAvoidedCo2EmissionsScore({
      projectDevelopmentPlanType: projectDevelopmentPlanType,
      aggregatedReconversionImpactMetrics: aggregatedReconversionImpacts.impactsMetrics,
      siteStatuQuoImpactMetrics: reconversionImpactsBreakdown.siteStatuQuoImpactMetrics,
    }),
    zanCompliance: getZanComplianceScore(siteReconversionType, soilsEvolutionDetails),
    soilsQuality: getSoilsQualityScore(soilsEvolutionDetails),
    waterQuality: getWaterQualityLetterScore(soilsEvolutionDetails),
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
      municipalityYearlyCapitalExpenditures: 1500000,
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
    }),
    accessToLocalServices: getAccessToLocalServicesScore(buildingsFloorAreaEvolution),
    accessToHealthCare: getAccessToHealthCareScore(buildingsFloorAreaEvolution),
    avoidedTrafficAccidents: getTrafficSecurityScore(aggregatedReconversionImpacts.impactsMetrics),
    avoidedFrichesAccidents: getFricheAccidentsScore(aggregatedReconversionImpacts.impactsMetrics),
  });

  const scores = [
    localAuthorityEconomicScore.numericScore,
    environmentScore.numericScore,
    fullTimeJobsScore.numericScore,
    localPeopleQualityOfLifeScore.numericScore,
  ];

  const projectNumericScore = roundTo2Digits(sumList(scores) / scores.length);

  return {
    numericScore: projectNumericScore,
    letterScore: convertNumberScoreToLetterScore(projectNumericScore),
    details: {
      environmentScore,
      fullTimeJobsScore,
      localPeopleQualityOfLifeScore,
      localAuthorityEconomicScore,
    },
  };
};

export type ProjectDevelopmentScore = {
  numericScore: number;
  letterScore: LetterGrade;
  details: {
    fullTimeJobsScore: {
      letterScore: LetterGrade;
      numericScore: number;
      details: {
        fullTimeJobs: ItemScoreResult<{
          fullTimeJobsDifferenceByHectare: number;
          siteStatuQuoFullTimeJobs: number;
          difference: number;
        }>;
      };
    };
    localPeopleQualityOfLifeScore: {
      letterScore: LetterGrade;
      numericScore: number;
      details: {
        livingEnvironment: ItemScoreResult<{
          siteReconversionType: SiteReconversionType;
        }>;
        localHealthiness: ItemScoreResult<{
          siteReconversionType: SiteReconversionType;
          sportsFacilitiesFloorSurface: number;
          newGreenSoilSurfaces: number;
        }>;
        accessToLocalServices: ItemScoreResult<{
          matchingBuildingsUses: BuildingUseSurface[];
        }>;
        accessToHealthCare: ItemScoreResult<{
          matchingBuildingsUses: BuildingUseSurface[];
        }>;
        avoidedTrafficAccidents: ItemScoreResult<{
          avoidedTrafficAccidents: number;
        }>;
        avoidedFrichesAccidents: ItemScoreResult<{
          avoidedFricheAccidents: number;
        }>;
      };
    };
    localAuthorityEconomicScore: {
      letterScore: LetterGrade;
      numericScore: number;
      details: {
        localAuthorityFinances: ItemScoreResult<{
          localAuthorityTotal: number;
          percentage: number;
          municipalityYearlyCapitalExpenditures: number;
        }>;
      };
    };
    environmentScore: {
      letterScore: LetterGrade;
      numericScore: number;
      details: {
        avoidedCo2Emissions: ItemScoreResult<{
          avoidedCo2eqEmissions: number;
          newStoredCo2Eq: number;
        }>;
        zanCompliance: ItemScoreResult<
          Pick<SoilEvolutionDetails, "newGreenSoilSurfaces" | "permeableSurfaceDifference"> & {
            siteReconversionType: SiteReconversionType;
          }
        >;
        soilsQuality: ItemScoreResult<
          Pick<SoilEvolutionDetails, "permeableSurfaceDifference" | "contamination">
        >;
        waterQuality: ItemScoreResult<
          Pick<SoilEvolutionDetails, "contamination"> & {
            prairieSurfaceDifference: number;
            forestSurfaceDifference: number;
            agriculturalSurfaceDifference: number;
            wetLandSurfaceDifference: number;
          }
        >;
        ecosystemServices: ItemScoreResult<{
          ecosystemicServices: AggregatedReconversionProjectOnSiteImpactItemView[];
        }>;
      };
    };
  };
};
