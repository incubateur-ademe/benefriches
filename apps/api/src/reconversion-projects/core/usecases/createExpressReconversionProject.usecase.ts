import {
  Address,
  SiteNature,
  SoilsDistribution,
  NewUrbanCenterProjectGenerator,
  ResidentialTenseAreaProjectGenerator,
  ResidentialProjectGenerator,
  PublicFacilitiesProjectGenerator,
  PhotovoltaicPowerPlantProjectGenerator,
  ManufacturingProjectGenerator,
  TourismAndCultureProjectGenerator,
  OfficesProjectGenerator,
  ExpressProjectCategory,
  RenaturationProjectGenerator,
} from "shared";

import { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectView, ReconversionProjectInput } from "../model/reconversionProject";

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
  save(reconversionProject: ReconversionProjectInput): Promise<void>;
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
  category?: ExpressProjectCategory;
};

type Response = ReconversionProjectView;

const getCreationServiceClass = (
  category: Exclude<ExpressProjectCategory, "PHOTOVOLTAIC_POWER_PLANT"> | undefined,
) => {
  switch (category) {
    case "NEW_URBAN_CENTER":
      return NewUrbanCenterProjectGenerator;
    case "RESIDENTIAL_TENSE_AREA":
      return ResidentialTenseAreaProjectGenerator;
    case "RESIDENTIAL_NORMAL_AREA":
      return ResidentialProjectGenerator;
    case "PUBLIC_FACILITIES":
      return PublicFacilitiesProjectGenerator;
    case "INDUSTRIAL_FACILITIES":
      return ManufacturingProjectGenerator;
    case "TOURISM_AND_CULTURAL_FACILITIES":
      return TourismAndCultureProjectGenerator;
    case "RENATURATION":
      return RenaturationProjectGenerator;
    case "OFFICES":
      return OfficesProjectGenerator;
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
        return {
          ...(await creationService.getReconversionProject()),
          soilsDistributionByType: creationService.projectSoilsDistributionByType,
        };
      }

      const ProjectGeneratorClass = getCreationServiceClass(props.category);

      const creationService = new ProjectGeneratorClass(
        this.dateProvider,
        props.reconversionProjectId,
        props.createdBy,
        siteData,
      );
      return {
        ...creationService.getReconversionProject(),
        soilsDistributionByType: creationService.projectSoilsDistributionByType,
      };
    })();

    await this.reconversionProjectRepository.save(reconversionProject);

    return reconversionProject;
  }
}
