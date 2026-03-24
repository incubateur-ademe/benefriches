import { createExpressSiteDtoSchema, CreateExpressSiteDto } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export const demoSiteSaved = createAppAsyncThunk(
  "siteCreation/demo/siteSaved",
  async (_, { getState, extra }) => {
    const { siteCreation, currentUser } = getState();
    const {
      DEMO_SITE_ACTIVITY_SELECTION,
      DEMO_SITE_ADDRESS,
      DEMO_SITE_NATURE_SELECTION,
      DEMO_SITE_SURFACE_AREA,
    } = siteCreation.demo.steps;

    if (!currentUser.currentUser) {
      throw new Error("Current user is missing");
    }

    if (!DEMO_SITE_ACTIVITY_SELECTION?.payload) {
      throw new Error("Site activity or type is missing");
    }

    const siteActivity = DEMO_SITE_ACTIVITY_SELECTION?.payload;

    const siteToCreate: CreateExpressSiteDto = createExpressSiteDtoSchema.parse({
      id: siteCreation.siteData.id,
      surfaceArea: DEMO_SITE_SURFACE_AREA?.payload?.surfaceArea,
      address: DEMO_SITE_ADDRESS?.payload?.address,
      nature: DEMO_SITE_NATURE_SELECTION?.payload?.siteNature,
      createdBy: currentUser.currentUser.id,
      siteNature: siteActivity.siteNature,
      activity:
        siteActivity.siteNature === "AGRICULTURAL_OPERATION"
          ? siteActivity.agriculturalOperationActivity
          : undefined,
      type: siteActivity.siteNature === "NATURAL_AREA" ? siteActivity.naturalAreaType : undefined,
      fricheActivity:
        siteActivity.siteNature === "FRICHE" ? siteActivity.fricheActivity : undefined,
    });

    await extra.createSiteService.saveExpress(siteToCreate);
  },
);
