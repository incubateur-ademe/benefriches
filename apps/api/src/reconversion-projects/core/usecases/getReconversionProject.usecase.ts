import type { TResult } from "src/shared-kernel/result";
import { fail, success } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";
import type { SitesQuery } from "src/sites/core/gateways/SitesQuery";
import type { SiteFeaturesView } from "src/sites/core/models/views";

import type { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import type { ReconversionProjectDataView } from "../model/reconversionProject";

type Request = {
  reconversionProjectId: string;
  authenticatedUserId: string;
};

type GetReconversionProjectResult = TResult<
  { projectData: ReconversionProjectDataView; siteData: SiteFeaturesView },
  "ValidationError" | "SiteNotFound" | "ReconversionProjectNotFound" | "UserNotAuthorized",
  { fieldErrors: Record<string, string[]> } | undefined
>;

export class GetReconversionProjectUseCase implements UseCase<
  Request,
  GetReconversionProjectResult
> {
  constructor(
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
    private readonly siteQuery: SitesQuery,
  ) {}

  async execute({
    reconversionProjectId,
    authenticatedUserId,
  }: Request): Promise<GetReconversionProjectResult> {
    const project = await this.reconversionProjectRepository.getById(reconversionProjectId);
    if (!project) return fail("ReconversionProjectNotFound");
    if (project.createdBy !== authenticatedUserId) return fail("UserNotAuthorized");

    const siteData = await this.siteQuery.getSiteFeaturesById(project.relatedSiteId);
    if (!siteData) {
      return fail("SiteNotFound");
    }

    return success({ projectData: project, siteData: siteData });
  }
}
