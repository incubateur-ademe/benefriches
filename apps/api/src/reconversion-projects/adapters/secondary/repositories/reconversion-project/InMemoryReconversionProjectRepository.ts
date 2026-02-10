import { ReconversionProjectRepository } from "src/reconversion-projects/core/gateways/ReconversionProjectRepository";
import {
  ReconversionProjectSaveDto,
  ReconversionProjectUpdateDto,
  ReconversionProjectDataView,
} from "src/reconversion-projects/core/model/reconversionProject";

export class InMemoryReconversionProjectRepository implements ReconversionProjectRepository {
  private reconversionProjects: ReconversionProjectSaveDto[] = [];

  async save(project: ReconversionProjectSaveDto) {
    this.reconversionProjects.push(project);
    await Promise.resolve();
  }

  async update(project: ReconversionProjectUpdateDto) {
    const existing = this.reconversionProjects.find(({ id }) => id === project.id);
    if (!existing) {
      throw new Error(
        "InMemoryReconversionProjectRepository > update: reconversion project not found",
      );
    }
    this.reconversionProjects = this.reconversionProjects.filter(({ id }) => id !== project.id);
    this.reconversionProjects.push({ ...existing, ...project });
    await Promise.resolve();
  }

  async patch(
    projectId: string,
    { status, updatedAt }: { status: "active" | "archived"; updatedAt: Date },
  ) {
    const existing = this.reconversionProjects.find(({ id }) => id === projectId);
    if (!existing) {
      throw new Error(
        "InMemoryReconversionProjectRepository > patch: reconversion project not found",
      );
    }
    this.reconversionProjects = this.reconversionProjects.filter(({ id }) => id !== projectId);
    this.reconversionProjects.push({ ...existing, status, updatedAt });
    await Promise.resolve();
  }

  getById(id: string): Promise<ReconversionProjectDataView | null> {
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

  _setReconversionProjects(reconversionProjects: ReconversionProjectSaveDto[]) {
    this.reconversionProjects = reconversionProjects;
  }
}
