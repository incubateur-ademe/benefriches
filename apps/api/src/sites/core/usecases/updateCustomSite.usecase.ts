import { DateProvider } from "src/shared-kernel/dateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesRepository } from "../gateways/SitesRepository";
import {
  CreateAgriculturalOrNaturalSiteProps,
  CreateFricheProps,
  CreateUrbanZoneSiteProps,
  updateSite,
} from "../models/site";
import { SiteEntity } from "../models/siteEntity";

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

type Request = {
  siteId: string;
  userId: string;
  siteProps:
    | DistributiveOmit<CreateAgriculturalOrNaturalSiteProps, "id">
    | (DistributiveOmit<CreateFricheProps, "id"> & { nature: "FRICHE" })
    | (DistributiveOmit<CreateUrbanZoneSiteProps, "id"> & { nature: "URBAN_ZONE" });
};

export type SiteNotEditableReason =
  | { reason: "NOT_CUSTOM"; creationMode: SiteEntity["creationMode"] }
  | { reason: "ACTIVE_RECONVERSION_PROJECT" };

type UpdateCustomSiteResult = TResult<
  void,
  "SiteNotFound" | "UserNotAuthorized" | "SiteNotEditable" | "ValidationError",
  unknown
>;

export class UpdateCustomSiteUseCase implements UseCase<Request, UpdateCustomSiteResult> {
  private readonly sitesRepository: SitesRepository;
  private readonly dateProvider: DateProvider;
  constructor(sitesRepository: SitesRepository, dateProvider: DateProvider) {
    this.sitesRepository = sitesRepository;
    this.dateProvider = dateProvider;
  }

  async execute({ siteId, userId, siteProps }: Request): Promise<UpdateCustomSiteResult> {
    const existingSite = await this.sitesRepository.getMetadataById(siteId);

    if (!existingSite) return fail("SiteNotFound");
    if (existingSite.createdBy !== userId) return fail("UserNotAuthorized");
    if (existingSite.creationMode !== "custom")
      return fail("SiteNotEditable", {
        reason: "NOT_CUSTOM",
        creationMode: existingSite.creationMode,
      });

    const hasActiveReconversionProject =
      await this.sitesRepository.hasActiveReconversionProject(siteId);
    if (hasActiveReconversionProject)
      return fail("SiteNotEditable", { reason: "ACTIVE_RECONVERSION_PROJECT" });

    const result = updateSite(existingSite.nature, { ...siteProps, id: siteId });

    if (!result.success) {
      return fail("ValidationError", result.error.fieldErrors);
    }

    const siteEntity: SiteEntity = {
      ...result.site,
      id: siteId,
      createdAt: existingSite.createdAt,
      createdBy: existingSite.createdBy,
      creationMode: existingSite.creationMode,
      status: existingSite.status,
      updatedAt: this.dateProvider.now(),
    };

    await this.sitesRepository.update(siteEntity);

    return success();
  }
}
