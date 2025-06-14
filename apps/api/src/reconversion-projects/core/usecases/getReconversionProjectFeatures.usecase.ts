import { BuildingsUseDistribution, SoilsDistribution, LEGACY_SpacesDistribution } from "shared";

import { UseCase } from "src/shared-kernel/usecase";

import { Schedule } from "../model/reconversionProject";

export type ReconversionProjectFeaturesView = {
  id: string;
  name: string;
  description?: string;
  isExpress: boolean;
  developmentPlan:
    | {
        type: "PHOTOVOLTAIC_POWER_PLANT";
        electricalPowerKWc: number;
        surfaceArea: number;
        expectedAnnualProduction: number;
        contractDuration: number;
        installationCosts: { amount: number; purpose: string }[];
        installationSchedule?: Schedule;
        developerName?: string;
      }
    | {
        type: "URBAN_PROJECT";
        developerName?: string;
        spaces: LEGACY_SpacesDistribution;
        buildingsFloorArea: BuildingsUseDistribution;
        installationCosts: { amount: number; purpose: string }[];
        installationSchedule?: Schedule;
      };
  soilsDistribution: SoilsDistribution;
  futureOwner?: string;
  futureOperator?: string;
  reinstatementContractOwner?: string;
  financialAssistanceRevenues?: { amount: number; source: string }[];
  reinstatementCosts?: { amount: number; purpose: string }[];
  yearlyProjectedExpenses: { amount: number; purpose: string }[];
  yearlyProjectedRevenues: { amount: number; source: string }[];
  reinstatementSchedule?: Schedule;
  firstYearOfOperation?: number;
  sitePurchaseTotalAmount?: number;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  decontaminatedSoilSurface?: number;
};

export interface ReconversionProjectQueryGateway {
  getFeaturesById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectFeaturesView | undefined>;
}

class ReconversionProjectIdRequiredError extends Error {
  constructor() {
    super(`GetReconversionProjectFeaturesUseCase: reconversionProjectId is required`);
    this.name = "ReconversionProjectIdRequiredError";
  }
}

type Request = {
  reconversionProjectId: string;
};

export class GetReconversionProjectFeaturesUseCase
  implements UseCase<Request, ReconversionProjectFeaturesView>
{
  constructor(private readonly reconversionProjectQuery: ReconversionProjectQueryGateway) {}

  async execute({ reconversionProjectId }: Request): Promise<ReconversionProjectFeaturesView> {
    if (!reconversionProjectId) {
      throw new ReconversionProjectIdRequiredError();
    }

    const result = await this.reconversionProjectQuery.getFeaturesById(reconversionProjectId);

    if (!result) throw new Error(`Reconversion project with id ${reconversionProjectId} not found`);
    return result;
  }
}
