import {
  Address,
  SiteNature,
  SoilsDistribution,
  NewUrbanCenterProjectGenerator,
  ResidentialTenseAreaProjectGenerator,
  ResidentialProjectGenerator,
  PublicFacilitiesProjectGenerator,
  PhotovoltaicPowerPlantProjectGenerator,
} from "shared";

import { PhotovoltaicDataProvider } from "src/location-features/core/gateways/PhotovoltaicDataProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProject } from "../model/reconversionProject";

type SiteView = {
  id: string;
  nature: SiteNature;
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
interface ReconversionProjectRepository {
  existsWithId(id: string): Promise<boolean>;
  save(reconversionProject: ReconversionProject): Promise<void>;
}

interface UserQuery {
  getById(
    id: string,
  ): Promise<{ structure: { activity?: string; name?: string; type?: string } } | undefined>;
}

type Request = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  category?:
    | "PUBLIC_FACILITIES"
    | "RESIDENTIAL_TENSE_AREA"
    | "RESIDENTIAL_NORMAL_AREA"
    | "NEW_URBAN_CENTER"
    | "PHOTOVOLTAIC_POWER_PLANT";
};

type Response = ReconversionProject;

const getCreationServiceClass = (category: Request["category"]) => {
  switch (category) {
    case "NEW_URBAN_CENTER":
      return NewUrbanCenterProjectGenerator;
    case "RESIDENTIAL_TENSE_AREA":
      return ResidentialTenseAreaProjectGenerator;
    case "RESIDENTIAL_NORMAL_AREA":
      return ResidentialProjectGenerator;
    case "PUBLIC_FACILITIES":
      return PublicFacilitiesProjectGenerator;
    default:
      return ResidentialProjectGenerator;
  }
};

export class CreateExpressReconversionProjectUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly siteQuery: SiteQuery,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
    private readonly photovoltaicPerformanceService: PhotovoltaicDataProvider,
    private readonly userQuery: UserQuery,
  ) {}

  async execute(props: Request): Promise<Response> {
    const siteData = await this.siteQuery.getById(props.siteId);
    if (!siteData) {
      throw new Error(`Site with id ${props.siteId} does not exist`);
    }

    const reconversionProject = await (async () => {
      if (props.category === "PHOTOVOLTAIC_POWER_PLANT") {
        const userData = await this.userQuery.getById(props.createdBy);
        const creationService = new PhotovoltaicPowerPlantProjectGenerator({
          dateProvider: this.dateProvider,
          reconversionProjectId: props.reconversionProjectId,
          userData: {
            id: props.createdBy,
            structureType:
              userData?.structure.type === "local_authority"
                ? userData.structure.activity
                : userData?.structure.type,
            structureName: userData?.structure.name,
          },
          siteData,
          photovoltaicPerformanceService: this.photovoltaicPerformanceService,
        });
        return await creationService.getReconversionProject();
      }

      const ProjectGeneratorClass = getCreationServiceClass(props.category);

      const creationService = new ProjectGeneratorClass(
        this.dateProvider,
        props.reconversionProjectId,
        props.createdBy,
        siteData,
      );
      return creationService.getReconversionProject();
    })();

    await this.reconversionProjectRepository.save(reconversionProject);

    return reconversionProject;
  }
}
