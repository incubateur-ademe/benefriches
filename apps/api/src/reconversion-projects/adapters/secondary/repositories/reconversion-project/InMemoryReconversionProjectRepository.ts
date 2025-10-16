import { ReconversionProjectRepository } from "src/reconversion-projects/core/gateways/ReconversionProjectRepository";
import { ReconversionProjectInput } from "src/reconversion-projects/core/model/reconversionProject";

export class InMemoryReconversionProjectRepository implements ReconversionProjectRepository {
  private reconversionProjects: ReconversionProjectInput[] = [];

  async save(project: ReconversionProjectInput) {
    this.reconversionProjects.push(project);
    await Promise.resolve();
  }

  async getById(id: string): Promise<ReconversionProjectInput | null> {
    const foundReconversionProject = this.reconversionProjects.find((project) => project.id === id);
    return Promise.resolve(foundReconversionProject ?? null);
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
