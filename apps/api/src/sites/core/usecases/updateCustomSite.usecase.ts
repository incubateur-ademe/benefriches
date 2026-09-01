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
import { getSiteEditability } from "../models/siteEditability";
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

export type SiteNotEditableIssues =
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

    // The definition of "has an active reconversion project" must stay identical across the
    // write path and the read paths (getSiteViewById, getUserSiteEvaluations) — all three derive
    // it from a `status = 'active'` filter, and diverging would let the API contradict itself.
    const hasActiveReconversionProject =
      await this.sitesRepository.hasActiveReconversionProject(siteId);

    const editability = getSiteEditability(
      {
        createdBy: existingSite.createdBy,
        creationMode: existingSite.creationMode,
        hasActiveReconversionProject,
      },
      userId,
    );

    if (!editability.isEditable) {
      switch (editability.notEditableReason) {
        case "NOT_CREATOR":
          return fail("UserNotAuthorized");
        case "NOT_CUSTOM":
          return fail("SiteNotEditable", {
            reason: "NOT_CUSTOM",
            creationMode: existingSite.creationMode,
          });
        case "ACTIVE_RECONVERSION_PROJECT":
          return fail("SiteNotEditable", { reason: "ACTIVE_RECONVERSION_PROJECT" });
      }
    }

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
