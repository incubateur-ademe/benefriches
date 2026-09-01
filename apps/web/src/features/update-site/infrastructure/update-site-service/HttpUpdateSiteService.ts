import {
  getSiteViewResponseDtoSchema,
  updateCustomSiteDtoSchema,
  type UpdateCustomSiteDto,
} from "shared";

import type { SiteUpdateView, UpdateSiteServiceGateway } from "../../core/updateSite.types";

// Deliberately does NOT reuse `HttpSiteService.getSiteView`: its
// `mapApiSiteFeaturesResponseToFeaturesView` flattens `address` to a plain string and drops
// `owner.structureType`/`tenant.structureType`, both of which the wizard's ADDRESS/OWNER/TENANT
// steps need to hydrate. This gateway returns the raw `GetSiteFeaturesResponseDto` instead.
export class HttpUpdateSiteService implements UpdateSiteServiceGateway {
  async getById(siteId: string): Promise<SiteUpdateView | undefined> {
    const response = await fetch(`/api/sites/${siteId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error("HttpUpdateSiteService: Error while fetching site");

    const jsonResponse = (await response.json()) as unknown;
    const result = getSiteViewResponseDtoSchema.safeParse(jsonResponse);
    if (!result.success) {
      throw new Error("HttpUpdateSiteService: Invalid response format", result.error);
    }

    return {
      features: result.data.features,
      isEditable: result.data.isEditable,
      notEditableReason: result.data.notEditableReason,
    };
  }

  async save(siteId: string, payload: UpdateCustomSiteDto): Promise<void> {
    const validatedPayload = updateCustomSiteDtoSchema.parse(payload);

    const response = await fetch(`/api/sites/${siteId}`, {
      method: "PUT",
      body: JSON.stringify(validatedPayload),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("HttpUpdateSiteService: Error while updating site");
  }
}
