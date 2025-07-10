import {
  ReconversionProject,
  SaveExpressReconversionProjectGateway,
} from "../../core/actions/expressProjectSavedGateway";
import { SaveExpressReconversionProjectPayload } from "./HttpSaveExpressReconversionProjectService";

export class InMemorySaveExpressReconversionProjectService
  implements SaveExpressReconversionProjectGateway
{
  _payloads: SaveExpressReconversionProjectPayload[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async save(newProject: SaveExpressReconversionProjectPayload) {
    if (this.shouldFail) throw new Error("Intended error");
    await Promise.resolve(this._payloads.push(newProject));
    return {
      id: "",
      createdBy: "",
      createdAt: new Date(),
      creationMode: "express",
      projectPhase: "setup",
      soilsDistribution: {
        CULTIVATION: 9000,
        IMPERMEABLE_SOILS: 30,
        MINERAL_SOIL: 1320,
        PRAIRIE_GRASS: 4650,
      },
      decontaminatedSoilSurface: undefined,
      yearlyProjectedCosts: [
        {
          amount: 6000,
          purpose: "rent",
        },
        {
          amount: 16500,
          purpose: "maintenance",
        },
        {
          amount: 6591,
          purpose: "taxes",
        },
        {
          amount: 0,
          purpose: "other",
        },
      ],
      yearlyProjectedRevenues: [
        {
          amount: 146445,
          source: "operations",
        },
      ],
      relatedSiteId: "",
      futureSiteOwner: undefined,
      futureOperator: {
        structureType: "company",
        name: "My company",
      },
      reinstatementCosts: undefined,
      reinstatementSchedule: undefined,
      reinstatementContractOwner: undefined,
      operationsFirstYear: 2026,
      name: "Centrale photovoltaïque",
      developmentPlan: {
        developer: {
          structureType: "company",
          name: "My company",
        },
        features: {
          surfaceArea: 15000,
          electricalPowerKWc: 1500,
          expectedAnnualProduction: 2253,
          contractDuration: 20,
        },
        installationSchedule: {
          startDate: new Date("2024-01-05").toDateString(),
          endDate: new Date("2025-01-05").toDateString(),
        },
        type: "PHOTOVOLTAIC_POWER_PLANT",
        costs: [
          {
            amount: 52500,
            purpose: "technical_studies",
          },
          {
            amount: 1110000,
            purpose: "development_works",
          },
          {
            amount: 112500,
            purpose: "other",
          },
        ],
      },
    } as ReconversionProject;
  }
}
