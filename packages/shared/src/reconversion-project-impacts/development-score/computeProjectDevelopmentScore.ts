import type { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import { roundTo2Digits, sumList } from "../../services";
import type { ProjectDevelopmentScore } from "./developmentScore.types";
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
import { getSiteReconversionType, getSoilEvolutionDetails } from "./readFeatures.helpers";
import {
  withFamilyScore,
  computeScoreFromGradePoints,
  withRequiredIndicatorScore,
  withNullableIndicatorScore,
} from "./scoring.helpers";

type ContextData = GetReconversionProjectImpactsResultDto["contextData"];

const isUrbanProject = (cx: ContextData) => cx.projectDevelopmentPlan.type === "URBAN_PROJECT";
const isFricheReconversion = (cx: ContextData) => cx.siteNature === "FRICHE";

export const computeProjectDevelopmentScore = (
  contextData: ContextData,
  impacts: Omit<GetReconversionProjectImpactsResultDto["impacts"], "developmentScore">,
): ProjectDevelopmentScore => {
  const soilsEvolutionDetails = getSoilEvolutionDetails({
    siteStatuQuoImpactMetrics: impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics,
    aggregatedReconversionImpactMetrics: impacts.aggregatedReconversionImpacts.impactsMetrics,
  });
  const siteReconversionType = getSiteReconversionType(contextData);
  const projectDevelopmentPlanType = contextData.projectDevelopmentPlan.type;

  const { aggregatedReconversionImpacts, reconversionImpactsBreakdown } = impacts;

  const environmentScore = withFamilyScore({
    co2eqEmissionsVariation: withRequiredIndicatorScore(
      getAvoidedCo2EmissionsScore({
        projectDevelopmentPlanType: projectDevelopmentPlanType,
        aggregatedReconversionImpactMetrics: aggregatedReconversionImpacts.impactsMetrics,
        siteStatuQuoImpactMetrics: reconversionImpactsBreakdown.siteStatuQuoImpactMetrics,
      }),
    ),
    zanCompliance: withNullableIndicatorScore({
      role: "core",
      applies: true,
      getScore: () => getZanComplianceScore({ siteReconversionType, soilsEvolutionDetails }),
    }),
    soilsQuality: withRequiredIndicatorScore(getSoilsQualityScore(soilsEvolutionDetails)),
    waterQuality: withRequiredIndicatorScore(getWaterQualityScore(soilsEvolutionDetails)),
    ecosystemServices: withRequiredIndicatorScore(
      getEcosystemServicesScore(aggregatedReconversionImpacts.indirectEconomicImpacts.details),
    ),
  });

  const fullTimeJobsScore = withFamilyScore({
    fullTimeJobs: withRequiredIndicatorScore(
      getFullTimeJobsScore({
        aggregatedReconversionImpactMetrics: impacts.aggregatedReconversionImpacts.impactsMetrics,
        siteSurfaceArea: contextData.siteSurfaceArea,
      }),
    ),
  });

  const localAuthorityEconomicScore = withFamilyScore({
    localAuthorityFinances: withRequiredIndicatorScore(
      getLocalAuthorityFinancesScore({
        aggregatedReconversionEconomicImpacts:
          impacts.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
        stakeholders: impacts.stakeholders,
        municipalityCapitalExpenditures: contextData.municipalityCapitalExpenditures,
      }),
    ),
  });

  const buildingsFloorAreaDistribution =
    projectDevelopmentPlanType === "URBAN_PROJECT"
      ? contextData.projectDevelopmentPlan.buildingsFloorAreaDistribution
      : {};

  const localPeopleQualityOfLifeScore = withFamilyScore({
    livingEnvironment: withRequiredIndicatorScore(
      getLivingEnvironmentScore({
        siteNature: contextData.siteNature,
        siteReconversionType: siteReconversionType,
        soilEvolutionDetails: soilsEvolutionDetails,
        buildingsFloorAreaDistribution: buildingsFloorAreaDistribution,
        projectDevelopmentPlanType,
      }),
    ),
    localHealthiness: withNullableIndicatorScore({
      role: "core",
      applies: isUrbanProject(contextData),
      getScore: () =>
        getLocalHealthinessScore({
          siteReconversionType: siteReconversionType,
          soilEvolutionDetails: soilsEvolutionDetails,
          buildingsFloorAreaDistribution: buildingsFloorAreaDistribution,
        }),
    }),
    accessToLocalServices: withNullableIndicatorScore({
      role: "bonus",
      applies: isUrbanProject(contextData),
      getScore: () => getAccessToLocalServicesScore(buildingsFloorAreaDistribution),
    }),
    accessToHealthCare: withNullableIndicatorScore({
      role: "bonus",
      applies: isUrbanProject(contextData),
      getScore: () => getAccessToHealthCareScore(buildingsFloorAreaDistribution),
    }),
    trafficSecurity: withNullableIndicatorScore({
      role: "bonus",
      applies: isFricheReconversion(contextData) && isUrbanProject(contextData),
      getScore: () => getTrafficSecurityScore(aggregatedReconversionImpacts.impactsMetrics),
    }),
    fricheAccidents: withNullableIndicatorScore({
      role: "bonus",
      applies: isFricheReconversion(contextData),
      getScore: () => getFricheAccidentsScore(aggregatedReconversionImpacts.impactsMetrics),
    }),
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
