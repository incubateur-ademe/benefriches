import { ExpressProjectCategory } from "shared";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { objectToQueryParams } from "@/shared/core/object-query-parameters/objectToQueryParameters";

import { CreateExpressReconversionProjectGateway } from "../../core/actions/expressProjectSavedGateway";

export type GetExpressReconversionProjectParams = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  category: ExpressProjectCategory;
};

export type SaveExpressReconversionProjectPayload = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  category: ExpressProjectCategory;
};

export default class HttpCreateExpressReconversionProjectService
  implements CreateExpressReconversionProjectGateway
{
  async get(params: GetExpressReconversionProjectParams) {
    const queryString = objectToQueryParams(params);

    const response = await fetch(`/api/reconversion-projects/create-from-site?${queryString}`);

    if (!response.ok) throw new Error("Error while fetching express reconversion project");

    return (await response.json()) as ProjectFeatures;
  }

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
