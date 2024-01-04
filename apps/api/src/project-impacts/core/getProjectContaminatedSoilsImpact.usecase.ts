import { UseCase } from "src/shared-kernel/usecase";

type Request = {
  projectId: string;
};

type Result = {
  contaminatedSoilsSurfaceDifference: number;
};

export interface ProjectRepository {
  getProjectDecontaminatedSoilsSurface(projectId: string): Promise<number | null>;
}

export class GetProjectContaminatedSoilsImpactUseCase implements UseCase<Request, Result> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({ projectId }: Request): Promise<Result> {
    if (!projectId) throw new Error("projectId is required");
    try {
      const result = await this.projectRepository.getProjectDecontaminatedSoilsSurface(projectId);
      return { contaminatedSoilsSurfaceDifference: result ?? 0 };
    } catch (err) {
      throw new Error(`Error while retrieving soils distribution for project ${projectId}`);
    }
  }
}
