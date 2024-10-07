import { SaveExpressReconversionProjectGateway } from "../../application/urban-project/urbanProject.actions";
import { SaveExpressReconversionProjectPayload } from "./HttpSaveExpressReconversionProjectService";

export class InMemorySaveExpressReconversionProjectService
  implements SaveExpressReconversionProjectGateway
{
  _payloads: SaveExpressReconversionProjectPayload[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async save(newProject: SaveExpressReconversionProjectPayload) {
    if (this.shouldFail) throw new Error("Intended error");
    await Promise.resolve(this._payloads.push(newProject));
  }
}
