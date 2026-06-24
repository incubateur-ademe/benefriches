import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import type { SiteActionsQuery } from "../gateways/SiteActionsQuery";
import type { SiteActionsRepository } from "../gateways/SiteActionsRepository";

type Request = {
  siteId: string;
  actionId: string;
  status: "skipped" | "done";
};

type UpdateSiteActionStatusResult = TResult<void, "ActionNotFound">;

export class UpdateSiteActionStatusUseCase implements UseCase<
  Request,
  UpdateSiteActionStatusResult
> {
  constructor(
    private readonly siteActionsRepository: SiteActionsRepository,
    private readonly siteActionsQuery: SiteActionsQuery,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ siteId, actionId, status }: Request): Promise<UpdateSiteActionStatusResult> {
    const actions = await this.siteActionsQuery.getBySiteId(siteId);

    const action = actions.find((a) => a.id === actionId);
    if (!action) {
      return fail("ActionNotFound");
    }

    // do not update if status is the same
    if (action.status === status) return success();

    const completedAt = status === "done" ? this.dateProvider.now() : undefined;

    await this.siteActionsRepository.updateStatus({
      siteId,
      actionType: action.actionType,
      status,
      completedAt,
    });

    return success();
  }
}
