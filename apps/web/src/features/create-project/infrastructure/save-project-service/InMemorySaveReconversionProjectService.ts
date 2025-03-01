import {
  SaveProjectPayload,
  SaveReconversionProjectGateway,
} from "../../core/actions/saveReconversionProject.action";

export class InMemorySaveReconversionProjectService implements SaveReconversionProjectGateway {
  _reconversionProjects: SaveProjectPayload[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async save(newProject: SaveProjectPayload) {
    if (this.shouldFail) throw new Error("Intended error");
    await Promise.resolve(this._reconversionProjects.push(newProject));
  }
}
