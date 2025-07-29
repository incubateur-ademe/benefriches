import {
  createAgriculturalOrNaturalSite,
  CreateAgriculturalOrNaturalSiteProps,
  createFriche,
  CreateFricheProps,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesRepository } from "../gateways/SitesRepository";
import { SiteEntity } from "../models/siteEntity";

type Request = {
  siteProps: CreateAgriculturalOrNaturalSiteProps | (CreateFricheProps & { nature: "FRICHE" });
  createdBy: string;
};

export class ValidationError extends Error {
  issues: Record<string, string[]>;

  constructor(message: string, issues: Record<string, string[]>) {
    super(message);
    this.issues = issues;
  }
}

export class CreateNewCustomSiteUseCase implements UseCase<Request, void> {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ siteProps, createdBy }: Request): Promise<void> {
    const result =
      siteProps.nature === "FRICHE"
        ? createFriche(siteProps)
        : createAgriculturalOrNaturalSite(siteProps);

    if (!result.success) {
      throw new ValidationError("Validation error", result.error.fieldErrors);
    }

    if (await this.sitesRepository.existsWithId(result.site.id)) {
      throw new Error(`Site with id ${result.site.id} already exists`);
    }

    const siteEntity: SiteEntity = {
      ...result.site,
      creationMode: "custom",
      createdAt: this.dateProvider.now(),
      createdBy,
    };

    await this.sitesRepository.save(siteEntity);
  }
}
