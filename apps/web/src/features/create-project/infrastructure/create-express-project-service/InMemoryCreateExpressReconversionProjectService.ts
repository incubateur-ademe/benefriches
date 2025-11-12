import {
  ExpressReconversionProjectResult,
  CreateExpressReconversionProjectGateway,
} from "../../core/actions/expressProjectSavedGateway";
import { SaveExpressReconversionProjectPayload } from "./HttpCreateExpressReconversionProjectService";

export class InMemoryCreateExpressReconversionProjectService
  implements CreateExpressReconversionProjectGateway
{
  private _shouldFail = false;
  generatedProjects: ExpressReconversionProjectResult[] = [];
  savedProjects: SaveExpressReconversionProjectPayload[] = [];

  constructor(generatedProjects: ExpressReconversionProjectResult[] = []) {
    this.generatedProjects = generatedProjects;
  }

  shouldFail() {
    this._shouldFail = true;
  }

  async get() {
    if (this._shouldFail) throw new Error("Intended error");

    const result = await Promise.resolve(this.generatedProjects[0]);

    if (!result) throw new Error("No project found");
    return result;
  }

  async save(newProject: SaveExpressReconversionProjectPayload) {
    if (this._shouldFail) throw new Error("Intended error");

    this.savedProjects.push(newProject);
    await Promise.resolve();
  }
}
