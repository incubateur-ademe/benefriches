import type { ReconversionProjectSavePropsDto } from "shared";

import type { ApiClient } from "./api-client";

export type TestUrbanProject = {
  id: string;
  name: string;
};

export type TestPhotovoltaicProject = {
  id: string;
  name: string;
};

type CreateCustomPhotovoltaicProjectProps = {
  id: string;
  createdBy: string;
  relatedSiteId: string;
  name: string;
  electricalPowerKWc: number;
  surfaceArea: number;
  expectedAnnualProduction: number;
  contractDuration: number;
  yearlyMaintenanceExpenseAmount: number;
};

export const createCustomPhotovoltaicProjectViaApi =
  (apiClient: ApiClient) =>
  async ({
    id,
    createdBy,
    relatedSiteId,
    name,
    electricalPowerKWc,
    surfaceArea,
    expectedAnnualProduction,
    contractDuration,
    yearlyMaintenanceExpenseAmount,
  }: CreateCustomPhotovoltaicProjectProps): Promise<TestPhotovoltaicProject> => {
    const body: ReconversionProjectSavePropsDto = {
      id,
      createdBy,
      relatedSiteId,
      name,
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        costs: [
          { amount: 130000, purpose: "installation_works" },
          { amount: 59999, purpose: "technical_studies" },
        ],
        developer: {
          name: "developer company name",
          structureType: "company",
        },
        features: {
          electricalPowerKWc,
          surfaceArea,
          expectedAnnualProduction,
          contractDuration,
        },
        installationSchedule: {
          startDate: new Date("2027-09-01"),
          endDate: new Date("2029-03-01"),
        },
      },
      soilsDistribution: [{ soilType: "MINERAL_SOIL", spaceCategory: undefined, surfaceArea }],
      involvesReinstatement: false,
      sitePurchaseSellingPrice: 150000,
      sitePurchasePropertyTransferDuties: 12000,
      operationsFirstYear: 2029,
      projectPhase: "design",
      // Purpose must match the wizard's own RecurringExpense Zod enum, otherwise the
      // "Dépenses annuelles" step fails client-side validation and the summary can't be saved.
      yearlyProjectedCosts: [{ purpose: "maintenance", amount: yearlyMaintenanceExpenseAmount }],
      yearlyProjectedRevenues: [],
    };

    const response = await apiClient.post("/api/reconversion-projects", body);

    if (!response.ok()) {
      throw new Error(
        `Failed to create custom photovoltaic project for user ${createdBy}: ${response.status()} ${await response.text()}`,
      );
    }

    return { id, name };
  };

type CreateCustomUrbanProjectProps = {
  id: string;
  createdBy: string;
  relatedSiteId: string;
  name: string;
  buildingsFloorAreaDistribution: Record<string, number>;
};

export const createCustomUrbanProjectViaApi =
  (apiClient: ApiClient) =>
  async ({
    id,
    createdBy,
    relatedSiteId,
    name,
    buildingsFloorAreaDistribution,
  }: CreateCustomUrbanProjectProps): Promise<TestUrbanProject> => {
    const body: ReconversionProjectSavePropsDto = {
      id,
      createdBy,
      relatedSiteId,
      name,
      developmentPlan: {
        type: "URBAN_PROJECT",
        costs: [
          { amount: 130000, purpose: "development_works" },
          { amount: 59999, purpose: "technical_studies" },
        ],
        developer: {
          name: "developer company name",
          structureType: "company",
        },
        features: {
          buildingsFloorAreaDistribution,
        },
        installationSchedule: {
          startDate: new Date("2028-07-01"),
          endDate: new Date("2029-03-01"),
        },
      },
      // Buildings are entirely new construction (no reuse of existing buildings), so the
      // "Bâtiments" wizard sub-steps are all answered and the group shows as complete.
      buildingsFootprintToReuse: 0,
      newBuildingsUsesFloorSurfaceArea: buildingsFloorAreaDistribution,
      // The developer will not itself construct the buildings, so the "Acteurs" wizard doesn't
      // require a buildings-constructor answer either — keeping the whole step sequence answered
      // so that submitting any step lands back on the summary instead of stepping forward.
      developerWillBeBuildingsConstructor: false,
      soilsDistribution: [
        {
          soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          spaceCategory: "PUBLIC_SPACE",
          surfaceArea: 1000,
        },
        {
          soilType: "ARTIFICIAL_TREE_FILLED",
          spaceCategory: "PUBLIC_GREEN_SPACE",
          surfaceArea: 5000,
        },
        { soilType: "BUILDINGS", spaceCategory: "LIVING_AND_ACTIVITY_SPACE", surfaceArea: 1500 },
      ],
      involvesReinstatement: true,
      reinstatementContractOwner: {
        name: "Reinstatement company",
        structureType: "company",
      },
      reinstatementCosts: [
        { amount: 120000, purpose: "waste_collection" },
        { amount: 33333, purpose: "deimpermeabilization" },
        { amount: 44444, purpose: "sustainable_soils_reinstatement" },
        { amount: 1, purpose: "other_reinstatement_costs" },
      ],
      sitePurchaseSellingPrice: 150000,
      sitePurchasePropertyTransferDuties: 12000,
      // Neither the site nor the buildings are resold after development (developer keeps
      // operating them), so the "Exploitation des bâtiments" operating-expenses step stays part
      // of the step sequence instead of being skipped in favor of a resale flow.
      financialAssistanceRevenues: [
        { amount: 14000, source: "public_subsidies" },
        { amount: 999.99, source: "other" },
      ],
      reinstatementSchedule: {
        startDate: new Date("2025-02-01"),
        endDate: new Date("2028-06-30"),
      },
      operationsFirstYear: 2029,
      projectPhase: "design",
      decontaminatedSoilSurface: 3000,
      // Purposes/sources must match the wizard's own Zod enums (yearlyBuildingsOperationsExpensePurposeSchema
      // and yearlyBuildingsOperationsRevenuePurposeSchema in shared), not the API's generic string schema,
      // otherwise the corresponding step fails client-side validation and the final summary can't be saved.
      yearlyProjectedCosts: [{ purpose: "maintenance", amount: 12000 }],
      yearlyProjectedRevenues: [{ source: "rent", amount: 13000 }],
    };

    const response = await apiClient.post("/api/reconversion-projects", body);

    if (!response.ok()) {
      throw new Error(
        `Failed to create custom urban project for user ${createdBy}: ${response.status()} ${await response.text()}`,
      );
    }

    return { id, name };
  };
