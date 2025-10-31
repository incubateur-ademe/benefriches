import {
  UpdateProjectSavePayload,
  UpdateProjectServiceGateway,
  UpdateProjectView,
} from "../../core/updateProject.types";

export class InMemoryUpdateReconversionProjectService implements UpdateProjectServiceGateway {
  _reconversionProjects: UpdateProjectSavePayload[] = [];
  _reconversionProjectView: UpdateProjectView | undefined = undefined;

  constructor(private readonly shouldFail: boolean = false) {}

  async getById(_: string) {
    return await Promise.resolve(this._reconversionProjectView);
  }

  async save(_: string, newProject: UpdateProjectSavePayload) {
    if (this.shouldFail) throw new Error("Intended error");
    await Promise.resolve(this._reconversionProjects.push(newProject));
  }
}
