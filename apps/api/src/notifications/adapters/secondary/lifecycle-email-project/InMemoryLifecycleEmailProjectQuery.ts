import type {
  LifecycleEmailProject,
  LifecycleEmailProjectQuery,
} from "src/notifications/core/gateways/LifecycleEmailProjectQuery";

export class InMemoryLifecycleEmailProjectQuery implements LifecycleEmailProjectQuery {
  private projects: LifecycleEmailProject[] = [];

  _setProjects(projects: LifecycleEmailProject[]): void {
    this.projects = projects;
  }

  getById(projectId: string): Promise<LifecycleEmailProject | undefined> {
    return Promise.resolve(this.projects.find((project) => project.id === projectId));
  }
}
