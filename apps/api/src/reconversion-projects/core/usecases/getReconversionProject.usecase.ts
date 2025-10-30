import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { SitesQuery, SiteViewModel } from "src/sites/core/gateways/SitesQuery";

import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import { ReconversionProjectInput } from "../model/reconversionProject";

type Request = {
  reconversionProjectId: string;
  authenticatedUserId: string;
};

type GetReconversionProjectResult = TResult<
  { projectData: ReconversionProjectInput; siteData: SiteViewModel },
  "ValidationError" | "SiteNotFound" | "ReconversionProjectNotFound" | "UserNotAuthorized",
  { fieldErrors: Record<string, string[]> } | undefined
>;

export class GetReconversionProjectUseCase
  implements UseCase<Request, GetReconversionProjectResult>
{
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

    const siteData = await this.siteQuery.getById(project.relatedSiteId);
    if (!siteData) {
      return fail("SiteNotFound");
    }

    return success({ projectData: project, siteData: siteData });
  }
}
