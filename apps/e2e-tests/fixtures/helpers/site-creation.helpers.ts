import type { CreateCustomSiteDto, CreateExpressSiteDto } from "shared";
import { generateSiteName } from "shared";

import type { ApiClient } from "./api-client";

export type TestSite = {
  id: string;
  name: string;
  creationMode: "express" | "custom";
};

export type FricheCustomSiteDto = Extract<CreateCustomSiteDto, { nature: "FRICHE" }>;
export type FricheExpressSiteDto = Extract<CreateExpressSiteDto, { nature: "FRICHE" }>;

export const createExpressSiteViaApi =
  (apiClient: ApiClient) =>
  async (siteData: Omit<FricheExpressSiteDto, "id">): Promise<TestSite> => {
    const siteId = crypto.randomUUID();

    const response = await apiClient.post("/api/sites/create-express", {
      ...siteData,
      id: siteId,
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to create express site for user ${siteData.createdBy}: ${response.status()} ${await response.text()}`,
      );
    }

    const siteName = generateSiteName({
      cityName: siteData.address.city,
      nature: siteData.nature,
      fricheActivity: siteData.fricheActivity,
    });

    return {
      id: siteId,
      name: siteName,
      creationMode: "express",
    };
  };

export const createCustomSiteViaApi =
  (apiClient: ApiClient) =>
  async (siteData: Omit<CreateCustomSiteDto, "id">): Promise<TestSite> => {
    const siteId = crypto.randomUUID();

    const response = await apiClient.post("/api/sites/create-custom", { ...siteData, id: siteId });

    if (!response.ok()) {
      throw new Error(
        `Failed to create custom site for user ${siteData.createdBy}: ${response.status()} ${await response.text()}`,
      );
    }

    return {
      id: siteId,
      name: siteData.name,
      creationMode: "custom",
    };
  };
