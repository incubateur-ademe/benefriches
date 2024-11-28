import { ProjectFeaturesGateway } from "../../application/project-features/projectFeatures.actions";
import { ProjectFeatures } from "../../domain/projects.types";

export class MockProjectFeaturesService implements ProjectFeaturesGateway {
  projectFeatures: ProjectFeatures = {
    id: "189038dd-3a6a-43af-bc8d-c4999d8d82ca",
    name: "Mocked project name",
    description: "Mocked project description",
    developmentPlan: {
      type: "PHOTOVOLTAIC_POWER_PLANT",
      developerName: "ADEME",
      installationCosts: [{ amount: 12000, purpose: "installation_works" }],
      installationSchedule: {
        startDate: "2029-01-01",
        endDate: "2029-12-31",
      },
      electricalPowerKWc: 12309,
      surfaceArea: 120000,
      expectedAnnualProduction: 4399,
      contractDuration: 20,
    },
    soilsDistribution: {
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 115000,
      MINERAL_SOIL: 3500,
      IMPERMEABLE_SOILS: 1500,
    },
    futureOwner: "ADEME",
    futureOperator: "ADEME",
    reinstatementContractOwner: "ADEME",
    financialAssistanceRevenues: [{ amount: 9999, source: "public_subsidies" }],
    reinstatementCosts: [
      {
        amount: 9999,
        purpose: "deimpermeabilization",
      },
    ],
    yearlyProjectedExpenses: [
      { amount: 9999, purpose: "maintenance" },
      { amount: 4009, purpose: "taxes" },
    ],
    yearlyProjectedRevenues: [
      {
        amount: 34000,
        source: "operations",
      },
    ],
    reinstatementSchedule: {
      startDate: "2029-01-01",
      endDate: "2029-12-31",
    },
    firstYearOfOperation: 2030,
    sitePurchaseTotalAmount: 540000,
  };

  _setProjectFeatures(projectFeatures: ProjectFeatures): void {
    this.projectFeatures = projectFeatures;
  }

  getById(): Promise<ProjectFeatures> {
    return Promise.resolve(this.projectFeatures);
  }
}
