import {
  SaveProjectPayload,
  SaveReconversionProjectGateway,
} from "../../application/saveReconversionProject.action";

export class HttpSaveReconversionProjectService implements SaveReconversionProjectGateway {
  async save(newReconversionProject: SaveProjectPayload) {
    const response = await fetch(`/api/reconversion-projects`, {
      method: "POST",
      body: JSON.stringify(newReconversionProject),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while saving new reconversion project");
  }
}
