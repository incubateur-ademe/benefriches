import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";

import {
  UpdateProjectSavePayload,
  UpdateProjectServiceGateway,
  UpdateProjectView,
} from "../../core/updateProject.actions";

const mockProjectData = {
  name: "Projet urbain mixte",
  isExpress: false,
  description: "",
  developmentPlan: {
    developer: { name: "Mairie d'Angers", structureType: "municipality" },
    installationCosts: [
      {
        amount: 810000,
        purpose: "development_works",
      },
      {
        amount: 90000,
        purpose: "technical_studies",
      },
      {
        amount: 81000,
        purpose: "other",
      },
    ],
    type: "URBAN_PROJECT",
    installationSchedule: {
      startDate: "2025-09-08T00:00:00.000Z",
      endDate: "2026-09-08T00:00:00.000Z",
    },
    buildingsFloorAreaDistribution: {
      RESIDENTIAL: 1250,
      LOCAL_STORE: 1250,
      LOCAL_SERVICES: 1250,
      ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 1000,
      PUBLIC_FACILITIES: 250,
    },
  },
  futureOwner: { name: "Futur propriétaire inconnu", structureType: "unknown" },
  reinstatementContractOwner: { name: "Mairie d'Angers", structureType: "municipality" },
  soilsDistribution: [
    {
      soilType: "BUILDINGS",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 937.5,
    },
    {
      soilType: "IMPERMEABLE_SOILS",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 937.5,
    },
    {
      soilType: "MINERAL_SOIL",
      spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
      surfaceArea: 937.5,
    },
    {
      soilType: "IMPERMEABLE_SOILS",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 1687.5,
    },
    {
      soilType: "MINERAL_SOIL",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 1125,
    },
    {
      soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      spaceCategory: "PUBLIC_SPACE",
      surfaceArea: 1875,
    },
    {
      soilType: "ARTIFICIAL_TREE_FILLED",
      spaceCategory: "PUBLIC_GREEN_SPACE",
      surfaceArea: 2812.5,
    },
  ],
  financialAssistanceRevenues: [
    {
      amount: 6500,
      source: "local_or_regional_authority_participation",
    },
    {
      amount: 15880,
      source: "public_subsidies",
    },
    {
      amount: 250,
      source: "other",
    },
  ],
  yearlyProjectedExpenses: [
    {
      purpose: "maintenance",
      amount: 25880,
    },
    {
      purpose: "taxes",
      amount: 2540,
    },
    {
      purpose: "other",
      amount: 1500,
    },
  ],
  yearlyProjectedRevenues: [
    {
      source: "rent",
      amount: 5000,
    },
  ],
  firstYearOfOperation: 2026,
  sitePurchaseSellingPrice: 50000,
  sitePurchasePropertyTransferDuties: 2905,
  siteResaleExpectedPropertyTransferDuties: 1000,
  siteResaleExpectedSellingPrice: 60000,
  projectPhase: "completed",
} satisfies UpdateProjectView["projectData"];

export class InMemoryUpdateReconversionProjectService implements UpdateProjectServiceGateway {
  _reconversionProjects: UpdateProjectSavePayload[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async getById(_: string) {
    return await Promise.resolve({
      projectData: mockProjectData,
      siteData: mockSiteData,
    });
  }

  async save(_: string, newProject: UpdateProjectSavePayload) {
    if (this.shouldFail) throw new Error("Intended error");
    await Promise.resolve(this._reconversionProjects.push(newProject));
  }
}
