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
import { v4 as uuid } from "uuid";

import { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectSaveDto } from "../model/reconversionProject";

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

interface UserQuery {
  getById(
    id: string,
  ): Promise<{ structure: { activity?: string; name?: string; type?: string } } | undefined>;
}

type Request = {
  siteId: string;
  category?: ExpressProjectCategory;
  createdBy: string;
  reconversionProjectId?: string;
};

type GenerateExpressReconversionProjectResult = TResult<ReconversionProjectSaveDto, "SiteNotFound">;

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

export class GenerateExpressReconversionProjectUseCase
  implements UseCase<Request, GenerateExpressReconversionProjectResult>
{
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly siteQuery: SiteQuery,
    private readonly photovoltaicPerformanceService: PhotovoltaicDataProvider,
    private readonly userQuery: UserQuery,
  ) {}

  async execute(props: Request): Promise<GenerateExpressReconversionProjectResult> {
    const siteData = await this.siteQuery.getById(props.siteId);
    if (!siteData) {
      return fail("SiteNotFound");
    }

    const projectId = props.reconversionProjectId ?? uuid();

    if (props.category === "PHOTOVOLTAIC_POWER_PLANT") {
      const userData = await this.userQuery.getById(props.createdBy);
      const creationService = new PhotovoltaicPowerPlantProjectGenerator({
        dateProvider: this.dateProvider,
        reconversionProjectId: projectId,
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
      return success(await creationService.getReconversionProject());
    }

    const UrbanProjectGeneratorClass = getCreationServiceClass(props.category);

    const creationService = new UrbanProjectGeneratorClass(
      this.dateProvider,
      projectId,
      props.createdBy,
      siteData,
    );

    return success(creationService.getReconversionProject());
  }
}
