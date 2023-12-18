import { UseCase } from "src/shared-kernel/usecase";
import { isPermeableSoil, SoilType } from "src/soils/domain/soils";

type Request = {
  projectId: string;
};

type Result = {
  permeableSoilsSurfaceDifference: number;
};

export type SoilsDistribution = { type: SoilType; surfaceArea: number }[];

export interface ProjectRepository {
  getProjectCurrentAndFutureSoilsDistribution(projectId: string): Promise<{
    current: SoilsDistribution;
    future: SoilsDistribution;
  }>;
}

const sumSurfaces = (soils: { surfaceArea: number }[]) => {
  return soils.reduce((sum, cur) => {
    return sum + cur.surfaceArea;
  }, 0);
};

export class GetProjectPermeableSoilsImpactsUseCase
  implements UseCase<Request, Result>
{
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({ projectId }: Request): Promise<Result> {
    if (!projectId) throw new Error("projectId is required");
    try {
      const projectSoilsDistribution =
        await this.projectRepository.getProjectCurrentAndFutureSoilsDistribution(
          projectId,
        );

      const currentPermeableSoilsSurface = sumSurfaces(
        projectSoilsDistribution.current.filter((soil) =>
          isPermeableSoil(soil.type),
        ),
      );
      const projectPermeableSoilsSurface = sumSurfaces(
        projectSoilsDistribution.future.filter((soil) =>
          isPermeableSoil(soil.type),
        ),
      );
      return {
        permeableSoilsSurfaceDifference:
          projectPermeableSoilsSurface - currentPermeableSoilsSurface,
      };
    } catch (err) {
      throw new Error(
        `Error while retrieving soils distribution for project ${projectId}`,
      );
    }
  }
}
