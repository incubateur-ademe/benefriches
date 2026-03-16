import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesRepository } from "../gateways/SitesRepository";

type Request = {
  siteId: string;
  userId: string;
};

type ArchiveSiteResult = TResult<void, "SiteNotFound" | "UserNotAuthorized">;

export class ArchiveSiteUseCase implements UseCase<Request, ArchiveSiteResult> {
  constructor(
    private readonly repository: SitesRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ siteId, userId }: Request): Promise<ArchiveSiteResult> {
    const siteCreatedById = await this.repository.getCreatedById(siteId);

    if (!siteCreatedById) return fail("SiteNotFound");
    if (siteCreatedById !== userId) return fail("UserNotAuthorized");

    await this.repository.patch(siteId, {
      status: "archived",
      updatedAt: this.dateProvider.now(),
    });

    return success();
  }
}
