import { getSiteFeaturesResponseDtoSchema, type GetSiteFeaturesResponseDto } from "shared";

import type { OwnerStructureType, TenantStructureType } from "@/shared/core/stakeholder";

import { GetSitesByIdGateway } from "../../core/actions/reconversionProjectCreationInitiated.action";
import { ProjectSite } from "../../core/project.types";

const mapDtoToProjectSite = (dto: GetSiteFeaturesResponseDto): ProjectSite => ({
  ...dto,
  owner: {
    structureType: dto.owner.structureType as OwnerStructureType,
    name: dto.owner.name ?? "",
  },
  tenant: dto.tenant
    ? {
        structureType: (dto.tenant.structureType ?? "") as TenantStructureType,
        name: dto.tenant.name ?? "",
      }
    : undefined,
});

export class HttpSitesService implements GetSitesByIdGateway {
  async getSiteFeaturesById(siteId: string): Promise<ProjectSite | undefined> {
    const response = await fetch(`/api/sites/${siteId}/features`);

    if (!response.ok) throw new Error(`Error while fetching site with id ${siteId}`);

    const jsonResponse: unknown = await response.json();
    const result = getSiteFeaturesResponseDtoSchema.safeParse(jsonResponse);

    if (!result.success) {
      throw new Error("HttpSitesService: Invalid response format");
    }

    return mapDtoToProjectSite(result.data);
  }
}
