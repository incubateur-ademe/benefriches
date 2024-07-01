import { SaveExpressReconversionProjectGateway } from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.actions";

export type SaveExpressReconversionProjectPayload = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
};

export default class HttpSaveExpressReconversionProjectService
  implements SaveExpressReconversionProjectGateway
{
  async save(payload: SaveExpressReconversionProjectPayload) {
    const response = await fetch(`/api/reconversion-projects/create-from-site`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while saving express reconversion project");
  }
}
