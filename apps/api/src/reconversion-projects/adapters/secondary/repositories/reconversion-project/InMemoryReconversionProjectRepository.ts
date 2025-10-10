import { ReconversionProjectInput } from "src/reconversion-projects/core/model/reconversionProject";
import { ReconversionProjectRepository } from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";

export class InMemoryReconversionProjectRepository implements ReconversionProjectRepository {
  private reconversionProjects: ReconversionProjectInput[] = [];

  async save(project: ReconversionProjectInput) {
    this.reconversionProjects.push(project);
    await Promise.resolve();
  }

  existsWithId(reconversionProjectId: string): Promise<boolean> {
    const foundReconversionProject = this.reconversionProjects.find(
      ({ id }) => id === reconversionProjectId,
    );
    return Promise.resolve(!!foundReconversionProject);
  }

  _getReconversionProjects() {
    return this.reconversionProjects;
  }

  _setReconversionProjects(reconversionProjects: ReconversionProjectInput[]) {
    this.reconversionProjects = reconversionProjects;
  }
}
