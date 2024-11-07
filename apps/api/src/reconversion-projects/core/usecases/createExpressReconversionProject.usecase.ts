import { SoilsDistribution } from "shared";
import { z } from "zod";

import { UseCase } from "src/shared-kernel/usecase";
import { Address } from "src/sites/core/models/site";

import { NewUrbanCenterProjectExpressCreationService } from "../model/create-from-site-services/NewUrbanCenterProjectExpressCreationService";
import { PublicFacilitiesProjectExpressCreationService } from "../model/create-from-site-services/PublicFacilitiesProjectExpressCreationService";
import { ResidentialProjectExpressCreationService } from "../model/create-from-site-services/ResidentialProjectExpressCreationService";
import { ResidentialTenseAreaProjectExpressCreationService } from "../model/create-from-site-services/ResidentialTenseAreaProjectExpressCreationService";
import { ReconversionProject, reconversionProjectPropsSchema } from "../model/reconversionProject";

export type SiteView = {
  id: string;
  isFriche: boolean;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface?: number;
  address: Address;
  owner: {
    structureType: string;
    name?: string;
  };
};

export interface SiteQuery {
  getById(id: string): Promise<SiteView | undefined>;
}
export interface ReconversionProjectRepository {
  existsWithId(id: string): Promise<boolean>;
  save(reconversionProject: ReconversionProject): Promise<void>;
}

export interface DateProvider {
  now(): Date;
}

export type ReconversionProjectProps = z.infer<typeof reconversionProjectPropsSchema>;

type Request = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  category?:
    | "PUBLIC_FACILITIES"
    | "RESIDENTIAL_TENSE_AREA"
    | "RESIDENTIAL_NORMAL_AREA"
    | "NEW_URBAN_CENTER";
};

type Response = {
  id: string;
  name: string;
};

const getCreationServiceClass = (category: Request["category"]) => {
  switch (category) {
    case "NEW_URBAN_CENTER":
      return NewUrbanCenterProjectExpressCreationService;
    case "RESIDENTIAL_TENSE_AREA":
      return ResidentialTenseAreaProjectExpressCreationService;
    case "RESIDENTIAL_NORMAL_AREA":
      return ResidentialProjectExpressCreationService;
    case "PUBLIC_FACILITIES":
      return PublicFacilitiesProjectExpressCreationService;
    default:
      return ResidentialProjectExpressCreationService;
  }
};

export class CreateExpressReconversionProjectUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly siteQuery: SiteQuery,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute(props: Request): Promise<Response> {
    const siteData = await this.siteQuery.getById(props.siteId);
    if (!siteData) {
      throw new Error(`Site with id ${props.siteId} does not exist`);
    }

    const ProjectExpressCreationServiceClass = getCreationServiceClass(props.category);

    const creationService = new ProjectExpressCreationServiceClass(
      this.dateProvider,
      props.reconversionProjectId,
      props.createdBy,
      siteData,
    );
    const reconversionProject = creationService.getReconversionProject();

    await this.reconversionProjectRepository.save(reconversionProject);

    return { id: reconversionProject.id, name: reconversionProject.name };
  }
}
