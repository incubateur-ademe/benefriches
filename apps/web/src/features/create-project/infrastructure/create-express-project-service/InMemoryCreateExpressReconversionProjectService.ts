import {
  ExpressReconversionProjectResult,
  CreateExpressReconversionProjectGateway,
} from "../../core/actions/expressProjectSavedGateway";
import {
  SaveExpressReconversionProjectPayload,
  GetExpressReconversionProjectParams,
} from "./HttpCreateExpressReconversionProjectService";

export class InMemoryCreateExpressReconversionProjectService
  implements CreateExpressReconversionProjectGateway
{
  _payloads: SaveExpressReconversionProjectPayload[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async get(newProject: GetExpressReconversionProjectParams) {
    if (this.shouldFail) throw new Error("Intended error");
    await Promise.resolve(this._payloads.push(newProject));
    return {
      id: "189038dd-3a6a-43af-bc8d-c4999d8d82ca",
      name: "Mocked project name",
      description: "Mocked project description",
      isExpress: false,
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
    } as ExpressReconversionProjectResult;
  }

  async save(newProject: SaveExpressReconversionProjectPayload) {
    if (this.shouldFail) throw new Error("Intended error");
    this._payloads.push(newProject);
    await Promise.resolve();
  }
}
