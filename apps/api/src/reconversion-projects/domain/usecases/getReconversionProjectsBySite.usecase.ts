import { UseCase } from "src/shared-kernel/usecase";

export type ReconversionProjectsGroupedBySite = {
  siteName: string;
  siteId: string;
  reconversionProjects: { id: string; name: string }[];
}[];

export interface ReconversionProjectsListRepository {
  getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite>;
}

export class GetReconversionProjectsBySiteUseCase
  implements UseCase<void, ReconversionProjectsGroupedBySite>
{
  constructor(
    private readonly reconversionProjectsListRepository: ReconversionProjectsListRepository,
  ) {}

  async execute(): Promise<ReconversionProjectsGroupedBySite> {
    const result = await this.reconversionProjectsListRepository.getGroupedBySite();
    return result;
  }
}
