import {
  createAgriculturalOrNaturalSite,
  CreateAgriculturalOrNaturalSiteProps,
  createFriche,
  CreateFricheProps,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesRepository } from "../gateways/SitesRepository";
import { SiteEntity } from "../models/siteEntity";

type Request = {
  siteProps: CreateAgriculturalOrNaturalSiteProps | (CreateFricheProps & { nature: "FRICHE" });
  createdBy: string;
};

type CreateNewCustomSiteResult = TResult<void, "ValidationError" | "SiteAlreadyExists", unknown>;

export class CreateNewCustomSiteUseCase implements UseCase<Request, CreateNewCustomSiteResult> {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ siteProps, createdBy }: Request): Promise<CreateNewCustomSiteResult> {
    const result =
      siteProps.nature === "FRICHE"
        ? createFriche(siteProps)
        : createAgriculturalOrNaturalSite(siteProps);

    if (!result.success) {
      return fail("ValidationError", result.error.fieldErrors);
    }

    if (await this.sitesRepository.existsWithId(result.site.id)) {
      return fail("SiteAlreadyExists");
    }

    const siteEntity: SiteEntity = {
      ...result.site,
      creationMode: "custom",
      createdAt: this.dateProvider.now(),
      createdBy,
    };

    await this.sitesRepository.save(siteEntity);

    return success();
  }
}
