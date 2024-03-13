import { UseCase } from "src/shared-kernel/usecase";

export type ReconversionProjectsGroupedBySite = {
  siteName: string;
  siteId: string;
  isFriche: boolean;
  reconversionProjects: { id: string; name: string }[];
}[];

export interface ReconversionProjectsListRepository {
  getGroupedBySite({ userId }: { userId: string }): Promise<ReconversionProjectsGroupedBySite>;
}

class UserIdRequiredError extends Error {
  constructor() {
    super(`GetUserReconversionProjectsBySite: userId is required`);
    this.name = "UserIdRequiredError";
  }
}

type Request = {
  userId: string;
};

export class GetUserReconversionProjectsBySiteUseCase
  implements UseCase<Request, ReconversionProjectsGroupedBySite>
{
  constructor(
    private readonly reconversionProjectsListRepository: ReconversionProjectsListRepository,
  ) {}

  async execute({ userId }: Request): Promise<ReconversionProjectsGroupedBySite> {
    if (!userId) {
      throw new UserIdRequiredError();
    }

    const result = await this.reconversionProjectsListRepository.getGroupedBySite({ userId });
    return result;
  }
}
