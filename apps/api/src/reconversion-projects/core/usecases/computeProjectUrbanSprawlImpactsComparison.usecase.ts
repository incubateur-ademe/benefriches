import {
  AgriculturalOperationGenerator,
  ComparisonRoadAndUtilitiesConstructionImpact,
  ComparisonRoadAndUtilitiesMaintenanceImpact,
  FricheGenerator,
  Impact,
  NaturalAreaGenerator,
  ReconversionProjectImpacts,
  ReconversionProjectImpactsDataView,
  roundTo2Digits,
  roundToInteger,
  SiteImpactsDataView,
  SiteNature,
  StatuQuoSiteImpacts,
  sumListWithKey,
  typedObjectEntries,
  UrbanSprawlComparisonImpacts,
  UrbanSprawlImpactsComparisonResult,
} from "shared";
import { v4 as uuid } from "uuid";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import {
  GetCarbonStorageFromSoilDistributionService,
  SoilsCarbonStorage,
} from "../gateways/SoilsCarbonStorageService";
import { PhotovoltaicProjectImpactsService } from "../model/project-impacts/PhotovoltaicProjectImpactsService";
import {
  InputReconversionProjectData,
  InputSiteData,
} from "../model/project-impacts/ReconversionProjectImpactsService";
import {
  SiteCityDataProps,
  UrbanProjectImpactsService,
} from "../model/project-impacts/UrbanProjectImpactsService";
import { Schedule } from "../model/reconversionProject";
import { SiteStatuQuoImpactsService } from "../model/site-statu-quo-impacts/SiteStatuQuoImpactsService";
import { SumOnEvolutionPeriodService } from "../model/sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeAvoidedRoadsAndUtilitiesExpenses } from "../model/urban-sprawl-impacts-comparison/roadAndUtilitiesMaintenance";
import { computeAvoidedRoadsAndUtilitiesConstruction } from "../model/urban-sprawl-impacts-comparison/roadsAndUtilitiesContruction";

export interface SiteImpactsQuery {
  getById(siteId: string): Promise<SiteImpactsDataView | undefined>;
}

type ApiReconversionProjectImpactsDataView = ReconversionProjectImpactsDataView<Schedule>;

type ReconversionProjectImpactsQueryResult = Omit<
  ApiReconversionProjectImpactsDataView,
  "developmentPlan"
> & {
  developmentPlan?: {
    installationCosts: ApiReconversionProjectImpactsDataView["developmentPlan"]["installationCosts"];
  } & Partial<Omit<ApiReconversionProjectImpactsDataView["developmentPlan"], "installationCosts">>;
};
export type ApiUrbanSprawlImpactsComparisonResult = UrbanSprawlImpactsComparisonResult<Schedule>;

export interface ReconversionProjectImpactsQuery {
  getById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsQueryResult | undefined>;
}

type Request = {
  reconversionProjectId: string;
  evaluationPeriodInYears: number;
  comparisonSiteNature: SiteNature;
};

class ReconversionProjectNotFound extends Error {
  constructor(reconversionProjectId: string) {
    super(
      `ComputeProjectUrbanSprawlImpactsComparisonUsecase: ReconversionProject with id ${reconversionProjectId} not found`,
    );
    this.name = "ReconversionProjectNotFound";
  }
}

class SiteNotFound extends Error {
  constructor(siteId: string) {
    super(`ComputeProjectUrbanSprawlImpactsComparisonUsecase: Site with id ${siteId} not found`);
    this.name = "SiteNotFound";
  }
}

class NoDevelopmentPlanType extends Error {
  constructor(reconversionProjectId: string) {
    super(
      `ComputeProjectUrbanSprawlImpactsComparisonUsecase: ReconversionProject with id ${reconversionProjectId} has no development plan`,
    );
    this.name = "NoDevelopmentPlanType";
  }
}

type FormatSiteDataForImpactsServiceProps = {
  siteData: SiteImpactsDataView;
  siteSoilsCarbonStorage?: SoilsCarbonStorage;
};
const formatSiteDataForImpactsService = ({
  siteData,
  siteSoilsCarbonStorage,
}: FormatSiteDataForImpactsServiceProps): InputSiteData => {
  const commonData = {
    ...siteData,
    addressCityCode: siteData.address.cityCode,
    soilsCarbonStorage: siteSoilsCarbonStorage,
  };
  switch (siteData.nature) {
    case "AGRICULTURAL_OPERATION":
      return {
        ...commonData,
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: siteData.agriculturalOperationActivity,
        isSiteOperated: siteData.isSiteOperated,
      };
    case "FRICHE":
      return {
        ...commonData,
        nature: "FRICHE",
        contaminatedSoilSurface: siteData.contaminatedSoilSurface,
        accidentsDeaths: siteData.accidentsDeaths,
        accidentsMinorInjuries: siteData.accidentsMinorInjuries,
        accidentsSevereInjuries: siteData.accidentsSevereInjuries,
      };
    case "NATURAL_AREA":
      return {
        ...commonData,
        nature: "NATURAL_AREA",
      };
  }
};

type ComputeReconversionProjectImpactsOnSiteProps = {
  siteCityData: SiteCityDataProps;
  inputSiteData: InputSiteData;
  inputReconversionProject: InputReconversionProjectData;
  evaluationPeriodInYears: number;
  dateProvider: DateProvider;
};
const computeReconversionProjectImpactsOnSite = ({
  inputSiteData,
  siteCityData,
  inputReconversionProject,
  evaluationPeriodInYears,
  dateProvider,
}: ComputeReconversionProjectImpactsOnSiteProps) => {
  switch (inputReconversionProject.developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT": {
      const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
        reconversionProject: inputReconversionProject,
        relatedSite: inputSiteData,
        evaluationPeriodInYears,
        dateProvider,
      });

      return photovoltaicProjectImpactsService.formatImpacts();
    }
    case "URBAN_PROJECT": {
      const urbanProjectImpactsService = new UrbanProjectImpactsService({
        reconversionProject: inputReconversionProject,
        relatedSite: inputSiteData,
        evaluationPeriodInYears,
        dateProvider: dateProvider,
        siteCityData: siteCityData,
      });
      return urbanProjectImpactsService.formatImpacts();
    }
  }
};

const sumImpact = (projectImpact?: Impact, siteImpact = 0) => {
  const { base = 0, forecast = 0, difference = 0 } = projectImpact ?? {};
  return {
    base: roundTo2Digits(base + siteImpact),
    forecast: roundTo2Digits(forecast + siteImpact),
    difference: roundTo2Digits(difference),
  };
};

const mergeSocioEconomicImpacts = (
  projectImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"],
  statuQuoSiteImpacts: StatuQuoSiteImpacts["socioEconomic"],
  roadAndUtilitiesImpacts: {
    maintenance: ComparisonRoadAndUtilitiesMaintenanceImpact;
    construction: ComparisonRoadAndUtilitiesConstructionImpact;
  },
): UrbanSprawlComparisonImpacts["socioeconomic"]["impacts"] => {
  const projectRentalIncome = projectImpacts.find(({ impact }) => impact === "rental_income");
  const projectWaterRegulation = projectImpacts.find(({ impact }) => impact === "water_regulation");
  const projectTaxesIncomesImpact = projectImpacts.find(({ impact }) => impact === "taxes_income");
  const projectRoadsAndUtilitiesExpenses = projectImpacts.find(
    ({ impact }) => impact === "roads_and_utilities_maintenance_expenses",
  );

  const shouldMergeRentalIncome =
    projectRentalIncome &&
    statuQuoSiteImpacts.direct.rentalIncome &&
    statuQuoSiteImpacts.direct.rentalIncome.actor === projectRentalIncome.actor;

  const impacts: UrbanSprawlComparisonImpacts["socioeconomic"]["impacts"] = projectImpacts.map(
    (projectImpact) => {
      if (projectImpact.impact === "roads_and_utilities_maintenance_expenses") {
        return roadAndUtilitiesImpacts.maintenance;
      }
      if (projectImpact.impact === "rental_income") {
        if (shouldMergeRentalIncome) {
          return {
            ...projectImpact,
            amount: projectImpact.amount + (statuQuoSiteImpacts.direct.rentalIncome?.amount ?? 0),
            details: [
              { amount: projectImpact.amount, impact: "project_rental_income" },
              {
                amount: statuQuoSiteImpacts.direct.rentalIncome?.amount ?? 0,
                impact: "site_statu_quo_rental_income",
              },
            ],
          };
        }
        return {
          ...projectImpact,
          amount: projectImpact.amount,
          details: [{ amount: projectImpact.amount, impact: "project_rental_income" }],
        };
      }
      if (projectImpact.impact === "taxes_income") {
        return {
          ...projectImpact,
          amount: projectImpact.amount + (statuQuoSiteImpacts.indirect.taxesIncomes?.amount ?? 0),
          details: [
            ...projectImpact.details,
            ...(statuQuoSiteImpacts.indirect.taxesIncomes?.details ?? []),
          ],
        };
      }

      if (projectImpact.impact === "water_regulation") {
        return {
          ...projectImpact,
          amount:
            projectImpact.amount + (statuQuoSiteImpacts.environmentalMonetary.waterRegulation ?? 0),
        };
      }
      if (projectImpact.impact === "ecosystem_services") {
        const details = projectImpact.details.map((element) => {
          switch (element.impact) {
            case "nature_related_wellness_and_leisure":
              return {
                impact: element.impact,
                amount: roundToInteger(
                  element.amount +
                    statuQuoSiteImpacts.environmentalMonetary.ecosystemServices
                      .natureRelatedWelnessAndLeisure,
                ),
              };
            case "forest_related_product":
              return {
                impact: element.impact,
                amount: roundToInteger(
                  element.amount +
                    statuQuoSiteImpacts.environmentalMonetary.ecosystemServices
                      .forestRelatedProduct,
                ),
              };

            case "pollination":
              return {
                impact: element.impact,
                amount: roundToInteger(
                  element.amount +
                    statuQuoSiteImpacts.environmentalMonetary.ecosystemServices.pollination,
                ),
              };

            case "invasive_species_regulation":
              return {
                impact: element.impact,
                amount: roundToInteger(
                  element.amount +
                    statuQuoSiteImpacts.environmentalMonetary.ecosystemServices
                      .invasiveSpeciesRegulation,
                ),
              };

            case "water_cycle":
              return {
                impact: element.impact,
                amount: roundToInteger(
                  element.amount +
                    statuQuoSiteImpacts.environmentalMonetary.ecosystemServices.waterCycle,
                ),
              };

            case "nitrogen_cycle":
              return {
                impact: element.impact,
                amount: roundToInteger(
                  element.amount +
                    statuQuoSiteImpacts.environmentalMonetary.ecosystemServices.nitrogenCycle,
                ),
              };

            case "soil_erosion":
              return {
                impact: element.impact,
                amount: roundToInteger(
                  element.amount +
                    statuQuoSiteImpacts.environmentalMonetary.ecosystemServices.soilErosion,
                ),
              };

            case "soils_co2_eq_storage":
              return {
                impact: element.impact,
                amount: roundToInteger(
                  element.amount +
                    (statuQuoSiteImpacts.environmentalMonetary.ecosystemServices.storedCo2Eq ?? 0),
                ),
              };
          }
        });
        return {
          ...projectImpact,
          details,
          amount: sumListWithKey(details, "amount"),
        };
      }
      return projectImpact;
    },
  );

  impacts.push(roadAndUtilitiesImpacts.construction);

  if (!projectRoadsAndUtilitiesExpenses) {
    impacts.push(roadAndUtilitiesImpacts.maintenance);
  }

  if (statuQuoSiteImpacts.direct.rentalIncome && !shouldMergeRentalIncome) {
    impacts.push({
      impact: "rental_income",
      actor: statuQuoSiteImpacts.direct.rentalIncome.actor,
      impactCategory: "economic_direct",
      amount: statuQuoSiteImpacts.direct.rentalIncome.amount,
      details: [
        {
          amount: statuQuoSiteImpacts.direct.rentalIncome.amount,
          impact: "site_statu_quo_rental_income",
        },
      ],
    });
  }

  if (statuQuoSiteImpacts.environmentalMonetary.waterRegulation && !projectWaterRegulation) {
    impacts.push({
      amount: statuQuoSiteImpacts.environmentalMonetary.waterRegulation,
      impact: "water_regulation",
      impactCategory: "environmental_monetary",
      actor: "community",
    });
  }

  if (statuQuoSiteImpacts.indirect.taxesIncomes && !projectTaxesIncomesImpact) {
    impacts.push({
      impact: "taxes_income",
      details: statuQuoSiteImpacts.indirect.taxesIncomes.details,
      amount: statuQuoSiteImpacts.indirect.taxesIncomes.amount,
      actor: "community",
      impactCategory: "economic_indirect",
    });
  }

  return statuQuoSiteImpacts.direct.fricheCosts
    ? impacts.concat(
        statuQuoSiteImpacts.direct.fricheCosts.map((impact) => ({
          ...impact,
          impactCategory: "economic_direct",
          impact: "statu_quo_friche_costs",
        })),
      )
    : impacts;
};

const mergeCarbonStorage = (
  projectSoilsCarbonStorage: ReconversionProjectImpacts["environmental"]["soilsCarbonStorage"],
  statuQuoSiteSoilsCarbonStorage: StatuQuoSiteImpacts["environmental"]["soilsCarbonStorage"],
) => {
  if (!projectSoilsCarbonStorage || !statuQuoSiteSoilsCarbonStorage) {
    return undefined;
  }
  const { base, forecast, difference, ...detailsCarbonStorage } = projectSoilsCarbonStorage;

  const mergedDetailsEntries = typedObjectEntries(detailsCarbonStorage).map(([key, impact]) => [
    key,
    sumImpact(impact, statuQuoSiteSoilsCarbonStorage[key]),
  ]);

  return {
    ...sumImpact({ base, forecast, difference }, statuQuoSiteSoilsCarbonStorage.total),
    ...Object.fromEntries(mergedDetailsEntries),
  } as ReconversionProjectImpacts["environmental"]["soilsCarbonStorage"];
};

type Props = {
  projectImpacts: ReconversionProjectImpacts;
  statuQuoSiteImpacts: StatuQuoSiteImpacts;
  conversionSiteIsFriche: boolean;
  conversionSiteSurfaceArea: number;
  projectDeveloperName?: string;
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
};
const computeUrbanSprawlComparisonImpacts = ({
  projectImpacts,
  statuQuoSiteImpacts,
  conversionSiteIsFriche,
  conversionSiteSurfaceArea,
  projectDeveloperName = "Aménageur",
  evaluationPeriodInYears,
  operationsFirstYear,
}: Props): UrbanSprawlComparisonImpacts => {
  const avoidedRoadsAndUtilitiesConstruction =
    computeAvoidedRoadsAndUtilitiesConstruction(conversionSiteSurfaceArea);
  const avoidedRoadsAndUtilitiesMaintenance = computeAvoidedRoadsAndUtilitiesExpenses({
    surfaceArea: conversionSiteSurfaceArea,
    sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
      evaluationPeriodInYears,
      operationsFirstYear,
    }),
  });

  const roadAndUtilitiesImpacts = conversionSiteIsFriche
    ? {
        construction: {
          amount: avoidedRoadsAndUtilitiesConstruction,
          impact: "avoided_roads_and_utilities_construction_expenses",
          impactCategory: "economic_direct",
          actor: projectDeveloperName,
        } as ComparisonRoadAndUtilitiesConstructionImpact,
        maintenance: {
          amount: avoidedRoadsAndUtilitiesMaintenance,
          impact: "avoided_roads_and_utilities_maintenance_expenses",
          impactCategory: "economic_indirect",
          actor: "community",
        } as ComparisonRoadAndUtilitiesMaintenanceImpact,
      }
    : {
        construction: {
          amount: -1 * avoidedRoadsAndUtilitiesConstruction,
          impact: "roads_and_utilities_construction_expenses",
          impactCategory: "economic_direct",
          actor: projectDeveloperName,
        } as ComparisonRoadAndUtilitiesConstructionImpact,
        maintenance: {
          amount: -1 * avoidedRoadsAndUtilitiesMaintenance,
          impact: "roads_and_utilities_maintenance_expenses",
          impactCategory: "economic_indirect",
          actor: "community",
        } as ComparisonRoadAndUtilitiesMaintenanceImpact,
      };
  const socioEconomicList = mergeSocioEconomicImpacts(
    projectImpacts.socioeconomic.impacts,
    statuQuoSiteImpacts.socioEconomic,
    roadAndUtilitiesImpacts,
  );

  return {
    economicBalance: projectImpacts.economicBalance,
    socioeconomic: {
      impacts: socioEconomicList,
      total: sumListWithKey(socioEconomicList, "amount"),
    },
    social: {
      fullTimeJobs: projectImpacts.social.fullTimeJobs
        ? {
            ...sumImpact(
              projectImpacts.social.fullTimeJobs,
              statuQuoSiteImpacts.social.fullTimeJobs,
            ),
            conversion: projectImpacts.social.fullTimeJobs.conversion,
            operations: sumImpact(
              projectImpacts.social.fullTimeJobs.operations,
              statuQuoSiteImpacts.social.fullTimeJobs,
            ),
          }
        : statuQuoSiteImpacts.social.fullTimeJobs
          ? {
              base: statuQuoSiteImpacts.social.fullTimeJobs,
              forecast: statuQuoSiteImpacts.social.fullTimeJobs,
              difference: 0,
              conversion: { base: 0, forecast: 0, difference: 0 },
              operations: {
                base: statuQuoSiteImpacts.social.fullTimeJobs,
                forecast: statuQuoSiteImpacts.social.fullTimeJobs,
                difference: 0,
              },
            }
          : undefined,
      accidents:
        projectImpacts.social.accidents || statuQuoSiteImpacts.social.accidents
          ? {
              ...sumImpact(
                projectImpacts.social.accidents,
                statuQuoSiteImpacts.social.accidents?.total,
              ),
              severeInjuries: sumImpact(
                projectImpacts.social.accidents?.severeInjuries,
                statuQuoSiteImpacts.social.accidents?.severeInjuries,
              ),
              minorInjuries: sumImpact(
                projectImpacts.social.accidents?.minorInjuries,
                statuQuoSiteImpacts.social.accidents?.minorInjuries,
              ),
              deaths: sumImpact(
                projectImpacts.social.accidents?.deaths,
                statuQuoSiteImpacts.social.accidents?.deaths,
              ),
            }
          : undefined,
      avoidedVehiculeKilometers: projectImpacts.social.avoidedVehiculeKilometers,
      travelTimeSaved: projectImpacts.social.travelTimeSaved,
      avoidedTrafficAccidents: projectImpacts.social.avoidedTrafficAccidents,
      householdsPoweredByRenewableEnergy: projectImpacts.social.householdsPoweredByRenewableEnergy,
    },
    environmental: {
      nonContaminatedSurfaceArea: sumImpact(
        projectImpacts.environmental.nonContaminatedSurfaceArea,
        -1 * (statuQuoSiteImpacts.environmental.contaminatedSurfaceArea ?? 0),
      ),
      permeableSurfaceArea: {
        ...sumImpact(
          projectImpacts.environmental.permeableSurfaceArea,
          statuQuoSiteImpacts.environmental.permeableSurfaceArea.total,
        ),
        mineralSoil: sumImpact(
          projectImpacts.environmental.permeableSurfaceArea.mineralSoil,
          statuQuoSiteImpacts.environmental.permeableSurfaceArea.mineralSoil,
        ),
        greenSoil: sumImpact(
          projectImpacts.environmental.permeableSurfaceArea.greenSoil,
          statuQuoSiteImpacts.environmental.permeableSurfaceArea.greenSoil,
        ),
      },
      soilsCo2eqStorage: projectImpacts.environmental.soilsCo2eqStorage
        ? sumImpact(
            projectImpacts.environmental.soilsCo2eqStorage,
            statuQuoSiteImpacts.environmental.soilsCo2eqStorage,
          )
        : undefined,
      avoidedCo2eqEmissions: projectImpacts.environmental.avoidedCo2eqEmissions,
      soilsCarbonStorage: mergeCarbonStorage(
        projectImpacts.environmental.soilsCarbonStorage,
        statuQuoSiteImpacts.environmental.soilsCarbonStorage,
      ),
    },
  };
};

export class ComputeProjectUrbanSprawlImpactsComparisonUseCase
  implements UseCase<Request, ApiUrbanSprawlImpactsComparisonResult>
{
  constructor(
    private readonly reconversionProjectQuery: ReconversionProjectImpactsQuery,
    private readonly siteRepository: SiteImpactsQuery,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    private readonly dateProvider: DateProvider,
    private readonly getCityRelatedDataService: GetCityRelatedDataService,
  ) {}

  async execute({
    reconversionProjectId,
    evaluationPeriodInYears,
    comparisonSiteNature,
  }: Request): Promise<ApiUrbanSprawlImpactsComparisonResult> {
    const reconversionProject = await this.reconversionProjectQuery.getById(reconversionProjectId);

    if (!reconversionProject) throw new ReconversionProjectNotFound(reconversionProjectId);

    if (
      !reconversionProject.developmentPlan ||
      !reconversionProject.developmentPlan.type ||
      !reconversionProject.developmentPlan.features
    ) {
      throw new NoDevelopmentPlanType(reconversionProjectId);
    }

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) throw new SiteNotFound(reconversionProject.relatedSiteId);

    const { squareMetersSurfaceArea, population } =
      await this.getCityRelatedDataService.getCityPopulationAndSurfaceArea(
        relatedSite.address.cityCode,
      );

    const comparisonSite = (() => {
      switch (comparisonSiteNature) {
        case "FRICHE":
          return new FricheGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: population,
            fricheActivity: "INDUSTRY",
          });
        case "AGRICULTURAL_OPERATION":
          return new AgriculturalOperationGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: population,
            operationActivity: "POLYCULTURE_AND_LIVESTOCK",
          });
        case "NATURAL_AREA":
          return new NaturalAreaGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: population,
            naturalAreaType: "PRAIRIE",
          });
      }
    })();

    const comparisonSiteData = {
      ...comparisonSite,
      isExpressSite: true,
      ownerName: comparisonSite.owner.name,
      ownerStructureType: comparisonSite.owner.structureType,
      soilsDistribution: comparisonSite.soilsDistribution.toJSON(),
    };

    const baseSiteSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.address.cityCode,
        soilsDistribution: relatedSite.soilsDistribution,
      });

    const projectSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.address.cityCode,
        soilsDistribution: reconversionProject.soilsDistribution,
      });

    const comparisonSiteSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: comparisonSiteData.address.cityCode,
        soilsDistribution: comparisonSiteData.soilsDistribution,
      });

    const baseInputSiteData = formatSiteDataForImpactsService({
      siteData: relatedSite,
      siteSoilsCarbonStorage: baseSiteSoilsCarbonStorage,
    });
    const comparisonInputSiteData = formatSiteDataForImpactsService({
      siteData: comparisonSiteData,
      siteSoilsCarbonStorage: comparisonSiteSoilsCarbonStorage,
    });

    const inputReconversionProjectData: InputReconversionProjectData = {
      ...reconversionProject,
      developmentPlanInstallationExpenses: reconversionProject.developmentPlan.installationCosts,
      developmentPlanType: reconversionProject.developmentPlan.type,
      developmentPlanDeveloperName: reconversionProject.developmentPlan.developerName,
      developmentPlanFeatures: reconversionProject.developmentPlan.features,
      soilsCarbonStorage: projectSoilsCarbonStorage,
    };

    const siteCityData = {
      citySquareMetersSurfaceArea: squareMetersSurfaceArea,
      cityPopulation: population,
    };

    const baseSiteCityData: SiteCityDataProps = await (async () => {
      if (relatedSite.nature === "FRICHE") {
        return {
          ...siteCityData,
          siteIsFriche: true,
          cityPropertyValuePerSquareMeter: (
            await this.getCityRelatedDataService.getPropertyValuePerSquareMeter(
              relatedSite.address.cityCode,
            )
          ).medianPricePerSquareMeters,
        };
      }
      return { siteIsFriche: false, ...siteCityData };
    })();

    const comparisonSiteCityData: SiteCityDataProps = await (async () => {
      if (comparisonSite.nature === "FRICHE") {
        return {
          ...siteCityData,
          siteIsFriche: true,
          cityPropertyValuePerSquareMeter: (
            await this.getCityRelatedDataService.getPropertyValuePerSquareMeter(
              relatedSite.address.cityCode,
            )
          ).medianPricePerSquareMeters,
        };
      }
      return { siteIsFriche: false, ...siteCityData };
    })();

    const baseSiteImpacts = new SiteStatuQuoImpactsService({
      siteData: { ...relatedSite, soilsCarbonStorage: baseSiteSoilsCarbonStorage },
      evaluationPeriodInYears,
      dateProvider: this.dateProvider,
    }).formatImpacts();

    const comparisonSiteImpacts = new SiteStatuQuoImpactsService({
      siteData: { ...comparisonSiteData, soilsCarbonStorage: comparisonSiteSoilsCarbonStorage },
      evaluationPeriodInYears,
      dateProvider: this.dateProvider,
    }).formatImpacts();

    const baseProjectImpacts = computeReconversionProjectImpactsOnSite({
      siteCityData: baseSiteCityData,
      dateProvider: this.dateProvider,
      inputSiteData: baseInputSiteData,
      inputReconversionProject: inputReconversionProjectData,
      evaluationPeriodInYears,
    });

    const comparisonProjectImpacts = computeReconversionProjectImpactsOnSite({
      siteCityData: comparisonSiteCityData,
      dateProvider: this.dateProvider,
      inputSiteData: comparisonInputSiteData,
      inputReconversionProject: inputReconversionProjectData,
      evaluationPeriodInYears,
    });

    const operationsFirstYear = this.dateProvider.now().getFullYear();

    return {
      baseCase: {
        statuQuoSiteImpacts: comparisonSiteImpacts,
        conversionSiteData: relatedSite,
        projectImpacts: baseProjectImpacts,
        comparisonImpacts: computeUrbanSprawlComparisonImpacts({
          projectImpacts: baseProjectImpacts,
          statuQuoSiteImpacts: comparisonSiteImpacts,
          conversionSiteIsFriche: relatedSite.nature === "FRICHE",
          conversionSiteSurfaceArea: relatedSite.surfaceArea,
          projectDeveloperName: reconversionProject.developmentPlan.developerName,
          evaluationPeriodInYears,
          operationsFirstYear,
        }),
      },
      comparisonCase: {
        statuQuoSiteImpacts: baseSiteImpacts,
        conversionSiteData: comparisonSiteData,
        projectImpacts: comparisonProjectImpacts,
        comparisonImpacts: computeUrbanSprawlComparisonImpacts({
          projectImpacts: comparisonProjectImpacts,
          statuQuoSiteImpacts: baseSiteImpacts,
          conversionSiteIsFriche: comparisonSiteData.nature === "FRICHE",
          conversionSiteSurfaceArea: comparisonSiteData.surfaceArea,
          projectDeveloperName: reconversionProject.developmentPlan.developerName,
          evaluationPeriodInYears,
          operationsFirstYear,
        }),
      },
      projectData: reconversionProject as ApiReconversionProjectImpactsDataView,
    };
  }
}
