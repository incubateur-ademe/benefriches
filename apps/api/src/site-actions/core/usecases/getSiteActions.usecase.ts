import type { GetSiteActionsResponseDto } from "shared";

import { TResult, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import type { SiteActionsQuery } from "../gateways/SiteActionsQuery";

type Request = {
  siteId: string;
};

type GetSiteActionsResult = TResult<GetSiteActionsResponseDto>;

export class GetSiteActionsUseCase implements UseCase<Request, GetSiteActionsResult> {
  constructor(private readonly siteActionsQuery: SiteActionsQuery) {}

  async execute({ siteId }: Request): Promise<GetSiteActionsResult> {
    const actions = await this.siteActionsQuery.getBySiteId(siteId);

    const dto: GetSiteActionsResponseDto = actions.map((action) => ({
      id: action.id,
      siteId: action.siteId,
      actionType: action.actionType,
      status: action.status,
    }));

    return success(dto);
  }
}
