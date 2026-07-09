import {
  ReconversionProjectImpacts,
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
  getProjectSoilDistributionByType,
  ReconversionProjectImpactsWithBreakEvenLevelInput,
  computeProjectImpactsWithBreakEvenLevel,
  formatAsSocioEconomicImpacts,
  sumListWithKey,
  formatEconomicBalanceImpact,
  roundTo1Digit,
  roundToInteger,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { CityStatsProvider } from "src/territory/core/gateways/CityStatsProvider";

import { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import { getDefaultImpactsEvaluationPeriod } from "../model/impactsEvaluationPeriod";
import { Schedule } from "../model/reconversionProject";

export interface SiteImpactsQuery {
  getById(siteId: string): Promise<SiteImpactsDataView | undefined>;
}

export type ApiReconversionProjectImpactsDataView = ReconversionProjectImpactsDataView<Schedule>;

type ReconversionProjectImpactsQueryResult = Omit<
  ApiReconversionProjectImpactsDataView,
  "developmentPlan"
> & {
  developmentPlan?: {
    installationCosts: ApiReconversionProjectImpactsDataView["developmentPlan"]["installationCosts"];
  } & Partial<Omit<ApiReconversionProjectImpactsDataView["developmentPlan"], "installationCosts">>;
};

export interface ReconversionProjectImpactsQuery {
  getById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsQueryResult | undefined>;
}

type Request = {
  reconversionProjectId: string;
  evaluationPeriodInYears?: number;
};

export type ComputedImpacts = {
  id: string;
  name: string;
  evaluationPeriodInYears: number;
  relatedSiteId: string;
  relatedSiteName: string;
  relatedSiteSurfaceArea: number;
  contaminatedSurfaceArea?: {
    base: number;
    forecast: number;
    difference: number;
  };
  impacts: ReconversionProjectImpacts;
};

type ComputeReconversionProjectImpactsResult = TResult<
  ComputedImpacts,
  "ReconversionProjectNotFound" | "SiteNotFound" | "NoDevelopmentPlanType"
>;

export class ComputeReconversionProjectImpactsUseCase implements UseCase<
  Request,
  ComputeReconversionProjectImpactsResult
> {
  private readonly reconversionProjectQuery: ReconversionProjectImpactsQuery;
  private readonly siteRepository: SiteImpactsQuery;
  private readonly cityStatsQuery: CityStatsProvider;
  private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService;
  private readonly dateProvider: DateProvider;
  constructor(
    reconversionProjectQuery: ReconversionProjectImpactsQuery,
    siteRepository: SiteImpactsQuery,
    cityStatsQuery: CityStatsProvider,
    getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    dateProvider: DateProvider,
  ) {
    this.reconversionProjectQuery = reconversionProjectQuery;
    this.siteRepository = siteRepository;
    this.cityStatsQuery = cityStatsQuery;
    this.getCarbonStorageFromSoilDistributionService = getCarbonStorageFromSoilDistributionService;
    this.dateProvider = dateProvider;
  }

  async execute({
    reconversionProjectId,
    evaluationPeriodInYears: inputEvaluationPeriodInYears,
  }: Request): Promise<ComputeReconversionProjectImpactsResult> {
    const reconversionProject = await this.reconversionProjectQuery.getById(reconversionProjectId);
    if (!reconversionProject) return fail("ReconversionProjectNotFound");

    if (
      !reconversionProject.developmentPlan?.type ||
      !reconversionProject.developmentPlan?.features
    ) {
      return fail("NoDevelopmentPlanType");
    }

    const evaluationPeriodInYears =
      inputEvaluationPeriodInYears ??
      getDefaultImpactsEvaluationPeriod(
        reconversionProject.developmentPlan.type,
        reconversionProject.developmentPlan.features,
      );

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) return fail("SiteNotFound");

    const operationsFirstYear =
      reconversionProject.operationsFirstYear ?? this.dateProvider.now().getFullYear();

    const soilsDistributionByType = getProjectSoilDistributionByType(
      reconversionProject.soilsDistribution,
    );
    const siteSoilsCarbonStorage = await this.getCarbonStorageFromSoilDistributionService.execute({
      cityCode: relatedSite.address.cityCode,
      soilsDistribution: relatedSite.soilsDistribution,
    });
    const projectSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.address.cityCode,
        soilsDistribution: soilsDistributionByType,
      });

    const cityStats = await this.cityStatsQuery.getCityStats(relatedSite.address.cityCode);
    const impacts = computeProjectImpactsWithBreakEvenLevel({
      reconversionProject: {
        ...reconversionProject,
        projectSoilsCarbonStorage,
        operationsFirstYear,
      } as ReconversionProjectImpactsWithBreakEvenLevelInput,
      relatedSite: { ...relatedSite, siteSoilsCarbonStorage },
      evaluationPeriodInYears,
      cityStats,
    });

    const contaminatedSurface =
      impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
        (item) => item.name === "contaminatedSurface",
      )?.total ?? 0;
    const decontaminatedSurface =
      impacts.reconversionImpactsBreakdown.projectIndirectImpactMetrics.find(
        (item) => item.name === "decontaminatedSurface",
      )?.total ?? 0;

    const baseSoilsCo2eqStorage =
      impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
        (item) => item.name === "storedCo2Eq",
      )?.total;
    const forecastSoilsCo2eqStorage = impacts.aggregatedReconversionImpacts.impactsMetrics.find(
      (item) => item.name === "newStoredCo2Eq",
    )?.total;

    const baseOperation = roundTo1Digit(
      impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
        (item) => item.name === "operationsFullTimeJobs",
      )?.total ?? 0,
    );
    const forecastOperation = roundTo1Digit(
      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
        (item) => item.name === "operationsFullTimeJobs",
      )?.total ?? 0,
    );

    const fullTimeJobsDifference = roundTo1Digit(
      sumListWithKey(
        impacts.aggregatedReconversionImpacts.impactsMetrics.filter(
          (item) =>
            item.name === "conversionFullTimeJobs" ||
            item.name === "operationsFullTimeJobs" ||
            item.name === "oldOperationsFullTimeJobsLoss" ||
            item.name === "reinstatementFullTimeJobs",
        ),
        "total",
      ),
    );

    const accidents = impacts.aggregatedReconversionImpacts.impactsMetrics.filter(
      (item) =>
        item.name === "avoidedFricheAccidentsDeaths" ||
        item.name === "avoidedFricheAccidentsSevereInjuries" ||
        item.name === "avoidedFricheAccidentsMinorInjuries",
    );

    const totalAccidents = sumListWithKey(accidents, "total");

    const avoidedTrafficAccidents = impacts.aggregatedReconversionImpacts.impactsMetrics.filter(
      (item) =>
        item.name === "avoidedTrafficAccidentsDeaths" ||
        item.name === "avoidedTrafficAccidentsSevereInjuries" ||
        item.name === "avoidedTrafficAccidentsMinorInjuries",
    );

    const avoidedTrafficAccidentsTotal = sumListWithKey(avoidedTrafficAccidents, "total");

    const baseGreen =
      impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
        (item) => item.name === "permeableGreenSurface",
      )?.total ?? 0;

    const baseMineral =
      impacts.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
        (item) => item.name === "permeableMineralSurface",
      )?.total ?? 0;

    const newPermeableGreenSurface =
      impacts.reconversionImpactsBreakdown.projectIndirectImpactMetrics.find(
        (it) => it.name === "newPermeableGreenSurface",
      )?.total ?? 0;

    const newPermeableMineralSurface =
      impacts.reconversionImpactsBreakdown.projectIndirectImpactMetrics.find(
        (it) => it.name === "newPermeableMineralSurface",
      )?.total ?? 0;

    const avoidedCO2TonsWithEnergyProduction =
      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
        (item) => item.name === "avoidedCO2TonsWithEnergyProduction",
      )?.total;

    const avoidedTrafficCo2EqEmissions = impacts.aggregatedReconversionImpacts.impactsMetrics.find(
      (item) => item.name === "avoidedTrafficCo2EqEmissions",
    )?.total;

    const avoidedAirConditioningCo2eqEmissions =
      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
        (item) => item.name === "avoidedAirConditioningCo2eqEmissions",
      )?.total;
    return success({
      id: reconversionProject.id,
      name: reconversionProject.name,
      evaluationPeriodInYears,
      relatedSiteId: relatedSite.id,
      relatedSiteName: relatedSite.name,
      relatedSiteSurfaceArea: relatedSite.surfaceArea,
      contaminatedSurfaceArea:
        contaminatedSurface || decontaminatedSurface
          ? {
              base: contaminatedSurface,
              forecast: contaminatedSurface - decontaminatedSurface,
              difference: -decontaminatedSurface,
            }
          : undefined,
      impacts: {
        economicBalance: formatEconomicBalanceImpact(
          impacts.projectEconomicBalance,
          impacts.stakeholders.project.developer.structureName ?? "Aménageur",
        ),
        social: {
          fullTimeJobs: {
            base: baseOperation,
            forecast: roundTo1Digit(fullTimeJobsDifference + baseOperation),
            difference: roundTo1Digit(fullTimeJobsDifference),
            operations: {
              base: baseOperation,
              forecast: forecastOperation,
              difference: roundTo1Digit(forecastOperation - baseOperation),
            },
            conversion: {
              base: 0,
              forecast: roundTo1Digit(fullTimeJobsDifference + baseOperation - forecastOperation),
              difference: roundTo1Digit(fullTimeJobsDifference + baseOperation - forecastOperation),
            },
          },
          accidents:
            accidents.length > 0
              ? {
                  base: totalAccidents,
                  forecast: 0,
                  difference: -totalAccidents,
                  severeInjuries: {
                    forecast: 0,
                    base:
                      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                        (item) => item.name === "avoidedFricheAccidentsSevereInjuries",
                      )?.total ?? 0,
                    difference: -(
                      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                        (item) => item.name === "avoidedFricheAccidentsSevereInjuries",
                      )?.total ?? 0
                    ),
                  },
                  minorInjuries: {
                    forecast: 0,
                    base:
                      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                        (item) => item.name === "avoidedFricheAccidentsMinorInjuries",
                      )?.total ?? 0,
                    difference: -(
                      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                        (item) => item.name === "avoidedFricheAccidentsMinorInjuries",
                      )?.total ?? 0
                    ),
                  },
                  deaths: {
                    base: 0,
                    forecast:
                      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                        (item) => item.name === "avoidedFricheAccidentsDeaths",
                      )?.total ?? 0,
                    difference:
                      impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                        (item) => item.name === "avoidedFricheAccidentsDeaths",
                      )?.total ?? 0,
                  },
                }
              : undefined,
          avoidedVehiculeKilometers: impacts.aggregatedReconversionImpacts.impactsMetrics.find(
            (item) => item.name === "avoidedVehiculeKilometers",
          )?.total,
          travelTimeSaved: impacts.aggregatedReconversionImpacts.impactsMetrics.find(
            (item) => item.name === "timeTravelSavedInHours",
          )?.total,
          avoidedTrafficAccidents:
            avoidedTrafficAccidentsTotal !== 0
              ? {
                  total: avoidedTrafficAccidentsTotal,
                  severeInjuries:
                    impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                      (item) => item.name === "avoidedTrafficAccidentsSevereInjuries",
                    )?.total ?? 0,
                  minorInjuries:
                    impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                      (item) => item.name === "avoidedTrafficAccidentsMinorInjuries",
                    )?.total ?? 0,
                  deaths:
                    impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                      (item) => item.name === "avoidedTrafficAccidentsDeaths",
                    )?.total ?? 0,
                }
              : undefined,
          householdsPoweredByRenewableEnergy: {
            base: 0,
            forecast:
              impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                (item) => item.name === "householdsPoweredByRenewableEnergy",
              )?.total ?? 0,
            difference:
              impacts.aggregatedReconversionImpacts.impactsMetrics.find(
                (item) => item.name === "householdsPoweredByRenewableEnergy",
              )?.total ?? 0,
          },
        },
        environmental: {
          nonContaminatedSurfaceArea:
            contaminatedSurface || decontaminatedSurface
              ? {
                  base: relatedSite.surfaceArea - contaminatedSurface,
                  forecast: relatedSite.surfaceArea - contaminatedSurface + decontaminatedSurface,
                  difference: decontaminatedSurface,
                }
              : undefined,
          permeableSurfaceArea: {
            base: baseMineral + baseGreen,
            forecast:
              baseMineral + newPermeableMineralSurface + baseGreen + newPermeableGreenSurface,
            difference: newPermeableGreenSurface + newPermeableMineralSurface,
            mineralSoil: {
              base: baseMineral,
              forecast: baseMineral + newPermeableMineralSurface,
              difference: newPermeableMineralSurface,
            },
            greenSoil: {
              base: baseGreen,
              forecast: baseGreen + newPermeableGreenSurface,
              difference: newPermeableGreenSurface,
            },
          },
          soilsCo2eqStorage:
            baseSoilsCo2eqStorage && forecastSoilsCo2eqStorage
              ? {
                  base: roundToInteger(baseSoilsCo2eqStorage),
                  forecast: roundToInteger(baseSoilsCo2eqStorage + forecastSoilsCo2eqStorage),
                  difference: roundToInteger(forecastSoilsCo2eqStorage),
                }
              : undefined,
          soilsCarbonStorage:
            siteSoilsCarbonStorage && projectSoilsCarbonStorage
              ? {
                  base: siteSoilsCarbonStorage?.total ?? 0,
                  forecast: projectSoilsCarbonStorage?.total ?? 0,
                  difference:
                    (projectSoilsCarbonStorage?.total ?? 0) - (siteSoilsCarbonStorage?.total ?? 0),
                }
              : undefined,
          avoidedCo2eqEmissions:
            reconversionProject.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
              ? {
                  withRenewableEnergyProduction: avoidedCO2TonsWithEnergyProduction
                    ? roundToInteger(avoidedCO2TonsWithEnergyProduction)
                    : undefined,
                }
              : {
                  withCarTrafficDiminution: avoidedTrafficCo2EqEmissions
                    ? roundToInteger(avoidedTrafficCo2EqEmissions)
                    : undefined,
                  withAirConditioningDiminution: avoidedAirConditioningCo2eqEmissions
                    ? roundToInteger(avoidedAirConditioningCo2eqEmissions)
                    : undefined,
                },
        },
        socioeconomic: formatAsSocioEconomicImpacts(impacts),
      },
    });
  }
}
