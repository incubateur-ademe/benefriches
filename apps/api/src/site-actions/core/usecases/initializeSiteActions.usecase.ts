import { siteActionTypeSchema } from "shared";

import { DateProvider } from "src/shared-kernel/dateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UidGenerator } from "src/shared-kernel/uidGenerator";
import { UseCase } from "src/shared-kernel/usecase";

import type { SiteActionsQuery } from "../gateways/SiteActionsQuery";
import type { SiteActionsRepository } from "../gateways/SiteActionsRepository";
import type { SiteAction } from "../models/siteAction";

type Request = {
  siteId: string;
};

type InitializeSiteActionsResult = TResult<void, "SiteAlreadyInitialized">;

export class InitializeSiteActionsUseCase implements UseCase<Request, InitializeSiteActionsResult> {
  private readonly siteActionsRepository: SiteActionsRepository;
  private readonly siteActionsQuery: SiteActionsQuery;
  private readonly dateProvider: DateProvider;
  private readonly uuidGenerator: UidGenerator;
  constructor(
    siteActionsRepository: SiteActionsRepository,
    siteActionsQuery: SiteActionsQuery,
    dateProvider: DateProvider,
    uuidGenerator: UidGenerator,
  ) {
    this.siteActionsRepository = siteActionsRepository;
    this.siteActionsQuery = siteActionsQuery;
    this.dateProvider = dateProvider;
    this.uuidGenerator = uuidGenerator;
  }

  async execute({ siteId }: Request): Promise<InitializeSiteActionsResult> {
    const existingActions = await this.siteActionsQuery.getBySiteId(siteId);

    if (existingActions.length > 0) {
      return fail("SiteAlreadyInitialized");
    }

    const now = this.dateProvider.now();
    const allActionTypes = siteActionTypeSchema.options;

    const siteActions: SiteAction[] = allActionTypes.map((actionType) => ({
      id: this.uuidGenerator.generate(),
      siteId,
      actionType,
      status: "todo",
      createdAt: now,
    }));

    await this.siteActionsRepository.save(siteActions);

    return success();
  }
}
