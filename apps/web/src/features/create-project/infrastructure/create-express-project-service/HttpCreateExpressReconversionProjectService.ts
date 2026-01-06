import { ReconversionProjectTemplate } from "shared";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { objectToQueryParams } from "@/shared/core/object-query-parameters/objectToQueryParameters";

import { CreateExpressReconversionProjectGateway } from "../../core/actions/expressProjectSavedGateway";

type GetExpressReconversionProjectParams = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  template: ReconversionProjectTemplate;
};

export type SaveExpressReconversionProjectPayload = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  template: ReconversionProjectTemplate;
};

export default class HttpCreateExpressReconversionProjectService implements CreateExpressReconversionProjectGateway {
  async get(params: GetExpressReconversionProjectParams) {
    const queryString = objectToQueryParams(params);

    const response = await fetch(`/api/reconversion-projects/create-from-template?${queryString}`);

    if (!response.ok) throw new Error("Error while fetching express reconversion project");

    return (await response.json()) as ProjectFeatures;
  }

  async save(payload: SaveExpressReconversionProjectPayload) {
    const response = await fetch(`/api/reconversion-projects/create-from-template`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while saving express reconversion project");
  }
}
