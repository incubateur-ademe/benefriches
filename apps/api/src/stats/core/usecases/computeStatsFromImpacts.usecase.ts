/* eslint-disable no-console */
import * as fs from "node:fs";
import path from "node:path";
import {
  AgriculturalOperationActivity,
  BuildingsUseDistribution,
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  FricheActivity,
  LEGACY_SpacesDistribution,
  NaturalAreaType,
  RecurringExpense,
  ReinstatementExpense,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
  SoilsDistribution,
  sumListWithKey,
  YearlyBuildingsOperationsRevenues,
} from "shared";

import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { CityStatsProvider } from "src/reconversion-projects/core/gateways/CityStatsProvider";
import { SoilsCarbonStorage } from "src/reconversion-projects/core/gateways/SoilsCarbonStorageService";
import { InputSiteData } from "src/reconversion-projects/core/model/project-impacts/ReconversionProjectImpactsService";
import { UrbanProjectImpactsService } from "src/reconversion-projects/core/model/project-impacts/UrbanProjectImpactsService";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import {
  SqlReconversionProjectSoilsDistribution,
  SqlSiteSoilsDistribution,
} from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { success, TResult } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

type StatsResult = {
  totalProjects: number;
  communityBenefits: {
    total: number;
  };
  soilsCo2eqStorage: {
    total: number;
  };
  avoidedCo2eqEmissions: {
    total: number;
    withAirConditioningDiminution: number;
    withCarTrafficDiminution: number;
    withRenewableEnergyProduction: number;
  };
  economicBalance: {
    totalExpenses: number;
    totalRevenues: number;
    balance: number;
  };
  details: {
    siteId: string;
    siteName: string;
    communityBenefits: number;
    soilsCo2eqStorage: number;
    avoidedCo2eqEmissions: number;
    economicBalance: number;
  }[];
};

type JsonSiteData = {
  id: string;
  name: string;
  description: string;
  nature: SiteNature;
  creation_mode: "custom" | "express";
  friche_activity?: FricheActivity;
  agricultural_operation_activity?: AgriculturalOperationActivity;
  natural_area_type?: NaturalAreaType;
  is_operated: boolean;
  surface_area: number;
  friche_contaminated_soil_surface_area?: number;
  friche_accidents_minor_injuries?: number;
  friche_accidents_severe_injuries?: number;
  friche_accidents_deaths?: number;
  owner_name: string;
  owner_structure_type: string;
  tenant_name?: string;
  site_expenses: string;
  site_incomes: string;
  site_soils_distributions: string;
  reconversion_project: string;
};
type JsonReconversionProject = {
  id: string;
  name: string;
  creation_mode: "custom";
  related_site_id: string;
  reinstatement_schedule_start_date: string | null;
  reinstatement_schedule_end_date: string | null;
  future_operator_name: string | null;
  future_site_owner_name: string | null;
  reinstatement_contract_owner_name: string | null;
  site_purchase_selling_price: number | null;
  site_purchase_property_transfer_duties: number | null;
  operations_first_year: number;
  site_resale_expected_selling_price: number | null;
  site_resale_expected_property_transfer_duties: number | null;
  buildings_resale_expected_selling_price: number | null;
  buildings_resale_expected_property_transfer_duties: number | null;
  friche_decontaminated_soil_surface_area: number | null;
  address: {
    city_code: string;
  };
  financial_assistance_revenues: FinancialAssistanceRevenue[] | null;
  yearly_revenues: YearlyBuildingsOperationsRevenues[] | null;
  yearly_expenses: RecurringExpense[] | null;
  reinstatement_costs: ReinstatementExpense[] | null;
  soils_distributions: SqlReconversionProjectSoilsDistribution[];
  development_plans: {
    id: string;
    type: "URBAN_PROJECT";
    features: {
      spacesDistribution: LEGACY_SpacesDistribution;
      buildingsFloorAreaDistribution: BuildingsUseDistribution;
    };
    developer_name: string | null;
    schedule_start_date: string | null;
    schedule_end_date: string | null;
    costs: DevelopmentPlanInstallationExpenses[] | null;
  }[];
};

type SiteInput = {
  id: string;
  description: string;
  name: string;
  nature: SiteNature;
  creation_mode: "custom" | "express";
  friche_activity?: FricheActivity;
  agricultural_operation_activity?: AgriculturalOperationActivity;
  natural_area_type?: NaturalAreaType;
  is_operated: boolean;
  surface_area: number;
  friche_contaminated_soil_surface_area?: number;
  friche_accidents_minor_injuries?: number;
  friche_accidents_severe_injuries?: number;
  friche_accidents_deaths?: number;
  owner_name: string;
  owner_structure_type: string;
  tenant_name?: string;
  site_expenses: SiteYearlyExpense[];
  site_incomes: SiteYearlyIncome[];
  soilsCarbonStorage: SoilsCarbonStorage;
  soilsDistribution: SoilsDistribution;
};

type ProjectInput = {
  id: string;
  name: string;
  creation_mode: "custom";
  related_site_id: string;
  reinstatement_schedule_start_date: string | null;
  reinstatement_schedule_end_date: string | null;
  future_operator_name: string | null;
  future_site_owner_name: string | null;
  reinstatement_contract_owner_name: string | null;
  site_purchase_selling_price: number | null;
  site_purchase_property_transfer_duties: number | null;
  operations_first_year: number;
  site_resale_expected_selling_price: number | null;
  site_resale_expected_property_transfer_duties: number | null;
  buildings_resale_expected_selling_price: number | null;
  buildings_resale_expected_property_transfer_duties: number | null;
  friche_decontaminated_soil_surface_area: number | null;
  address: {
    city_code: string;
  };
  financial_assistance_revenues: FinancialAssistanceRevenue[];
  yearly_revenues: YearlyBuildingsOperationsRevenues[];
  yearly_expenses: RecurringExpense[];
  reinstatement_costs: ReinstatementExpense[];
  soilsDistribution: SoilsDistribution;
  soilsCarbonStorage: SoilsCarbonStorage;
  developmentPlan: {
    id: string;
    type: "URBAN_PROJECT";
    features: {
      spacesDistribution: LEGACY_SpacesDistribution;
      buildingsFloorAreaDistribution: BuildingsUseDistribution;
    };
    developer_name: string | null;
    schedule_start_date: string | null;
    schedule_end_date: string | null;
    costs: DevelopmentPlanInstallationExpenses[];
  };
};

type CityStats = {
  population: number;
  propertyValueMedianPricePerSquareMeters: number;
  surfaceAreaSquareMeters: number;
};
function computeProjectImpacts(
  siteInput: SiteInput,
  projectInput: ProjectInput,
  cityStats: CityStats,
  dateProvider: DateProvider,
  evaluationPeriodInYears: number,
) {
  const siteData: InputSiteData = (() => {
    const commonData = {
      addressCityCode: projectInput.address.city_code,
      soilsDistribution: siteInput.soilsDistribution,
      surfaceArea: siteInput.surface_area,
      ownerName: siteInput.owner_name,
      yearlyExpenses: siteInput.site_expenses,
      yearlyIncomes: siteInput.site_incomes,
      tenantName: siteInput.tenant_name,
      soilsCarbonStorage: siteInput.soilsCarbonStorage,
    };
    switch (siteInput.nature) {
      case "AGRICULTURAL_OPERATION":
        return {
          ...commonData,
          nature: "AGRICULTURAL_OPERATION",
          agriculturalOperationActivity: siteInput.agricultural_operation_activity,
          isSiteOperated: siteInput.is_operated,
        };
      case "FRICHE":
        return {
          ...commonData,
          nature: "FRICHE",
          contaminatedSoilSurface: siteInput.friche_contaminated_soil_surface_area,
          accidentsDeaths: siteInput.friche_accidents_deaths,
          accidentsMinorInjuries: siteInput.friche_accidents_minor_injuries,
          accidentsSevereInjuries: siteInput.friche_accidents_severe_injuries,
        };
      case "NATURAL_AREA":
        return {
          ...commonData,
          nature: "NATURAL_AREA",
        };
    }
  })();

  const developmentPlan = projectInput.developmentPlan;

  const urbanProjectImpactsService = new UrbanProjectImpactsService({
    reconversionProject: {
      operationsFirstYear: projectInput.operations_first_year,
      developmentPlanDeveloperName: developmentPlan.developer_name ?? "",
      futureOperatorName: projectInput.future_operator_name ?? undefined,
      futureSiteOwnerName: projectInput.future_site_owner_name ?? undefined,
      reinstatementContractOwnerName: projectInput.reinstatement_contract_owner_name ?? undefined,
      reinstatementExpenses: projectInput.reinstatement_costs ?? [],
      yearlyProjectedExpenses: projectInput.yearly_expenses ?? [],
      yearlyProjectedRevenues: projectInput.yearly_revenues ?? [],
      sitePurchaseTotalAmount:
        (projectInput.site_purchase_property_transfer_duties ?? 0) +
        (projectInput.site_purchase_selling_price ?? 0),
      sitePurchasePropertyTransferDutiesAmount:
        projectInput.site_purchase_property_transfer_duties ?? undefined,
      siteResaleSellingPrice: projectInput.site_resale_expected_selling_price ?? undefined,
      buildingsResaleSellingPrice:
        projectInput.buildings_resale_expected_selling_price ?? undefined,
      financialAssistanceRevenues: projectInput.financial_assistance_revenues ?? [],
      developmentPlanType: developmentPlan.type,
      developmentPlanFeatures: developmentPlan.features,
      developmentPlanInstallationExpenses: developmentPlan.costs,
      conversionSchedule:
        developmentPlan.schedule_start_date && developmentPlan.schedule_end_date
          ? {
              startDate: new Date(developmentPlan.schedule_start_date),
              endDate: new Date(developmentPlan.schedule_end_date),
            }
          : undefined,
      reinstatementSchedule:
        projectInput.reinstatement_schedule_start_date &&
        projectInput.reinstatement_schedule_end_date
          ? {
              startDate: new Date(projectInput.reinstatement_schedule_start_date),
              endDate: new Date(projectInput.reinstatement_schedule_end_date),
            }
          : undefined,
      soilsDistribution: projectInput.soilsDistribution,
      decontaminatedSoilSurface: projectInput.friche_decontaminated_soil_surface_area ?? 0,
      soilsCarbonStorage: projectInput.soilsCarbonStorage,
    },
    relatedSite: siteData,
    evaluationPeriodInYears: evaluationPeriodInYears,
    dateProvider: dateProvider,
    siteCityData: {
      siteIsFriche: true,
      citySquareMetersSurfaceArea: cityStats.surfaceAreaSquareMeters,
      cityPopulation: cityStats.population,
      cityPropertyValuePerSquareMeter: cityStats.propertyValueMedianPricePerSquareMeters,
    },
  });

  const impacts = urbanProjectImpactsService.formatImpacts();

  return {
    communityBenefits: sumListWithKey(
      impacts.socioeconomic.impacts.filter(({ actor }) => actor === "community"),
      "amount",
    ),
    soilsCo2eqStorage: impacts.environmental.soilsCo2eqStorage?.difference ?? 0,
    avoidedCo2eqEmissions: {
      total:
        (impacts.environmental.avoidedCo2eqEmissions?.withAirConditioningDiminution ?? 0) +
        (impacts.environmental.avoidedCo2eqEmissions?.withCarTrafficDiminution ?? 0),
      withAirConditioningDiminution:
        impacts.environmental.avoidedCo2eqEmissions?.withAirConditioningDiminution ?? 0,
      withCarTrafficDiminution:
        impacts.environmental.avoidedCo2eqEmissions?.withCarTrafficDiminution ?? 0,
    },
    economicBalance: impacts.economicBalance,
    socioEconomicTotal: impacts.socioeconomic.total,
  };
}

function formatResults(results: StatsResult): string {
  return `
═══════════════════════════════════════════════════════════
RÉSULTATS AGRÉGÉS - ${results.totalProjects} friches avec un projet urbain custom
═══════════════════════════════════════════════════════════

- Bénéfices pour la collectivité
  Total: ${results.communityBenefits.total.toLocaleString("fr-FR")} €

- Stockage carbone dans les sols
  Total CO2eq: ${results.soilsCo2eqStorage.total.toLocaleString("fr-FR")} tonnes

- Émissions de co2eq évitées
  Total: ${results.avoidedCo2eqEmissions.total.toLocaleString("fr-FR")} tonnes
    - Climatisation: ${results.avoidedCo2eqEmissions.withAirConditioningDiminution.toLocaleString("fr-FR")} t
    - Trafic routier: ${results.avoidedCo2eqEmissions.withCarTrafficDiminution.toLocaleString("fr-FR")} t
    
- Bilan économique
    - Dépenses totales: ${results.economicBalance.totalExpenses.toLocaleString("fr-FR")} €
    - Recettes totales: ${results.economicBalance.totalRevenues.toLocaleString("fr-FR")} €
    - Balance totale: ${results.economicBalance.balance.toLocaleString("fr-FR")} €

═══════════════════════════════════════════════════════════
DÉTAIL PAR SITE
═══════════════════════════════════════════════════════════
${results.details
  .toSorted((a, b) => a.soilsCo2eqStorage - b.soilsCo2eqStorage)
  .map(
    (d) => `
Site: ${d.siteName} (${d.siteId})
  - Bénéfices collectivité: ${d.communityBenefits.toLocaleString("fr-FR")} €
  - Stockage CO2eq: ${d.soilsCo2eqStorage.toLocaleString("fr-FR")} t
  - CO2eq évitées: ${d.avoidedCo2eqEmissions.toLocaleString("fr-FR")} t
  - Balance économique: ${d.economicBalance.toLocaleString("fr-FR")} €
`,
  )
  .join("\n")}
`;
}

const jsonFileData = fs.readFileSync(path.resolve("data/", "prod_data.json"), "utf-8");

type Request = { evaluationPeriodInYears: number };

type Result = TResult<
  StatsResult,
  "ValidationError" | "ReconversionProjectNotFound" | "UserNotAuthorized",
  { fieldErrors: Record<string, string[]> } | undefined
>;

export class ComputeReconversionProjectImpactsStatsUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    private readonly dateProvider: DateProvider,
    private readonly cityStatsQuery: CityStatsProvider,
  ) {}

  async execute({ evaluationPeriodInYears }: Request): Promise<Result> {
    const entries = JSON.parse(jsonFileData) as JsonSiteData[];

    const results: StatsResult = {
      totalProjects: entries.length,
      communityBenefits: {
        total: 0,
      },
      soilsCo2eqStorage: {
        total: 0,
      },
      avoidedCo2eqEmissions: {
        total: 0,
        withAirConditioningDiminution: 0,
        withCarTrafficDiminution: 0,
        withRenewableEnergyProduction: 0,
      },
      economicBalance: {
        totalExpenses: 0,
        totalRevenues: 0,
        balance: 0,
      },
      details: [],
    };

    for (const entry of entries) {
      try {
        console.log(`⏳⏳ Process site ${entry.name} (${entry.id})`);
        const reconversionProject = JSON.parse(
          entry.reconversion_project,
        ) as JsonReconversionProject;

        const developmentPlan = reconversionProject.development_plans?.[0];
        if (!developmentPlan || developmentPlan.type !== "URBAN_PROJECT") {
          console.log(`Site ${entry.id} ignoré (pas un URBAN_PROJECT)`);
          continue;
        }

        const site_soils_distributions = JSON.parse(
          entry.site_soils_distributions,
        ) as SqlSiteSoilsDistribution[];
        const siteSoilsDistributions = site_soils_distributions.reduce<SoilsDistribution>(
          (result, { soil_type, surface_area }) => ({
            ...result,
            [soil_type]: (result[soil_type] ?? 0) + surface_area,
          }),
          {},
        );
        const siteCarbonStorage = await this.getCarbonStorageFromSoilDistributionService.execute({
          cityCode: reconversionProject.address.city_code,
          soilsDistribution: siteSoilsDistributions,
        });

        if (!siteCarbonStorage) {
          console.warn("--> Cannot get siteCarbonStorage");
        }

        const siteInput: SiteInput = {
          ...entry,
          site_incomes: entry.site_incomes
            ? (JSON.parse(entry.site_incomes) as SiteYearlyIncome[])
            : [],
          site_expenses: entry.site_expenses
            ? (JSON.parse(entry.site_expenses) as SiteYearlyExpense[])
            : [],
          soilsDistribution: siteSoilsDistributions,
          soilsCarbonStorage: siteCarbonStorage ?? { total: 0 },
        };

        const project_soils_distributions = reconversionProject.soils_distributions;
        const projectSoilsDistributions = project_soils_distributions.reduce<SoilsDistribution>(
          (result, { soil_type, surface_area }) => ({
            ...result,
            [soil_type]: (result[soil_type] ?? 0) + surface_area,
          }),
          {},
        );
        const projectCarbonStorage = await this.getCarbonStorageFromSoilDistributionService.execute(
          {
            cityCode: reconversionProject.address.city_code,
            soilsDistribution: projectSoilsDistributions,
          },
        );

        if (!projectCarbonStorage) {
          console.warn("--> Cannot get projectCarbonStorage");
        }

        const projectInput: ProjectInput = {
          ...reconversionProject,
          developmentPlan: {
            ...developmentPlan,
            costs: developmentPlan.costs ?? [],
          },
          yearly_expenses: reconversionProject.yearly_expenses ?? [],
          yearly_revenues: reconversionProject.yearly_revenues ?? [],
          financial_assistance_revenues: reconversionProject.financial_assistance_revenues ?? [],
          reinstatement_costs: reconversionProject.reinstatement_costs ?? [],
          soilsDistribution: projectSoilsDistributions,
          soilsCarbonStorage: projectCarbonStorage ?? { total: 0 },
        };

        const cityStats = await this.cityStatsQuery.getCityStats(
          reconversionProject.address.city_code,
        );

        const projectImpacts = computeProjectImpacts(
          siteInput,
          projectInput,
          cityStats,
          this.dateProvider,
          evaluationPeriodInYears,
        );

        results.communityBenefits.total += projectImpacts.communityBenefits;
        results.soilsCo2eqStorage.total += projectImpacts.soilsCo2eqStorage;
        results.avoidedCo2eqEmissions.total += projectImpacts.avoidedCo2eqEmissions.total;
        results.avoidedCo2eqEmissions.withAirConditioningDiminution +=
          projectImpacts.avoidedCo2eqEmissions.withAirConditioningDiminution;
        results.avoidedCo2eqEmissions.withCarTrafficDiminution +=
          projectImpacts.avoidedCo2eqEmissions.withCarTrafficDiminution;
        results.economicBalance.totalExpenses += projectImpacts.economicBalance.costs.total;
        results.economicBalance.totalRevenues += projectImpacts.economicBalance.revenues.total;
        results.economicBalance.balance += projectImpacts.economicBalance.total;

        results.details.push({
          siteId: entry.id,
          siteName: entry.name,
          communityBenefits: projectImpacts.communityBenefits,
          soilsCo2eqStorage: projectImpacts.soilsCo2eqStorage,
          avoidedCo2eqEmissions: projectImpacts.avoidedCo2eqEmissions.total,
          economicBalance: projectImpacts.economicBalance.total,
        });

        console.log(`🆗🆗 Site processed ${entry.name} (${entry.id})`);
      } catch (error) {
        console.error(`Erreur lors du traitement du site ${entry.id}:`, error);
      }
    }

    console.log(formatResults(results));

    return success(results);
  }
}
