import { updateCustomSiteDtoSchema, type UpdateCustomSiteDto } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { createFetchSiteMunicipalityData } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import { createFetchSiteSoilsCarbonStorage } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import { createCustomFormActions } from "@/features/create-site/core/custom/custom.actions";
import { createCustomFormSelectors } from "@/features/create-site/core/custom/customForm.selectors";
import { deriveSiteDataFromCustomSteps } from "@/features/create-site/core/custom/customSteps";
import { createSiteFormRootSelectors } from "@/features/create-site/core/selectors/createSite.selectors";
import { siteUpdateLens } from "@/features/create-site/core/siteForm.lens";
import { buildUrbanZoneSiteDataForSave } from "@/features/create-site/core/urban-zone/buildUrbanZoneSitePayload";
import { createUrbanZoneFormActions } from "@/features/create-site/core/urban-zone/urban-zone.actions";
import { createUrbanZoneFormSelectors } from "@/features/create-site/core/urban-zone/urbanZoneForm.selectors";

import type { SiteUpdateView } from "./updateSite.types";

const UPDATE_SITE_STORE_KEY = "siteUpdate";

export const updateCustomFormActions = createCustomFormActions(`${UPDATE_SITE_STORE_KEY}/custom`);
export const updateUrbanZoneFormActions = createUrbanZoneFormActions(
  `${UPDATE_SITE_STORE_KEY}/urbanZone`,
);

export const updateSiteRootSelectors = createSiteFormRootSelectors(siteUpdateLens);
export const updateCustomFormSelectors = createCustomFormSelectors(siteUpdateLens);
export const updateUrbanZoneFormSelectors = createUrbanZoneFormSelectors(siteUpdateLens);

export const fetchSiteUpdateMunicipalityData = createFetchSiteMunicipalityData(
  `${UPDATE_SITE_STORE_KEY}/fetchSiteMunicipalityData`,
  updateSiteRootSelectors,
);

export const fetchSiteUpdateSoilsCarbonStorage = createFetchSiteSoilsCarbonStorage(
  `${UPDATE_SITE_STORE_KEY}/fetchSiteSoilsCarbonStorage`,
  updateSiteRootSelectors,
);

export const siteUpdateInitiated = createAppAsyncThunk<SiteUpdateView, string>(
  `${UPDATE_SITE_STORE_KEY}/init`,
  async (siteId, { extra }) => {
    const result = await extra.updateSiteService.getById(siteId);
    if (!result) throw new Error("Site not found");
    return result;
  },
);

export const siteUpdateSaved = createAppAsyncThunk(
  `${UPDATE_SITE_STORE_KEY}/saved`,
  async (_, { getState, extra }) => {
    const { siteUpdate } = getState();
    if (!siteUpdate.siteId) throw new Error("siteUpdateSaved: missing siteId");

    const siteData = deriveSiteDataFromCustomSteps(
      { ...siteUpdate.initialSiteData, isFriche: siteUpdate.isFriche, nature: siteUpdate.nature },
      siteUpdate.custom.steps,
    );

    const base = {
      name: siteData.name ?? "",
      description: siteData.description,
      address: siteData.address!,
      owner: siteData.owner,
      tenant: siteData.tenant,
      yearlyExpenses: siteData.yearlyExpenses,
      yearlyIncomes: siteData.yearlyIncomes,
    };

    // The URBAN_ZONE branch below builds fields (`manager`, `vacantCommercialPremisesFootprint`)
    // the read-side types leave optional but the write DTO requires — `updateCustomSiteDtoSchema
    // .parse` is the actual guard rail (see risk notes on ticket 11): a site missing one throws
    // there rather than being silently narrowed away at compile time.
    let payload: UpdateCustomSiteDto | Record<string, unknown>;
    switch (siteData.nature) {
      case "FRICHE":
        payload = {
          ...base,
          nature: "FRICHE",
          fricheActivity: siteData.fricheActivity,
          soilsDistribution: siteData.soilsDistribution ?? {},
          ...(siteData.hasContaminatedSoils && {
            contaminatedSoilSurface: siteData.contaminatedSoilSurface,
          }),
          accidentsMinorInjuries: siteData.accidentsMinorInjuries,
          accidentsSevereInjuries: siteData.accidentsSevereInjuries,
          accidentsDeaths: siteData.accidentsDeaths,
        };
        break;
      case "AGRICULTURAL_OPERATION":
        payload = {
          ...base,
          nature: "AGRICULTURAL_OPERATION",
          agriculturalOperationActivity: siteData.agriculturalOperationActivity!,
          soilsDistribution: siteData.soilsDistribution ?? {},
          isSiteOperated: Boolean(siteData.isSiteOperated),
        };
        break;
      case "NATURAL_AREA":
        payload = {
          ...base,
          nature: "NATURAL_AREA",
          naturalAreaType: siteData.naturalAreaType!,
          soilsDistribution: siteData.soilsDistribution ?? {},
        };
        break;
      case "URBAN_ZONE": {
        // Two-engine flow (see updateSite.reducer.ts): ADDRESS/SURFACE_AREA/URBAN_ZONE_TYPE
        // live on `siteData` (derived above from `siteUpdate.custom.steps`), everything else
        // on `siteUpdate.urbanZone.steps` — `buildUrbanZoneSiteDataForSave` is the same builder
        // creation's `urbanZoneSiteSaved` uses, unchanged (ticket 11).
        const {
          id: _id,
          address: _address,
          owner: _owner,
          tenant: _tenant,
          urbanZoneType: _urbanZoneType,
          ...urbanZoneSiteData
        } = buildUrbanZoneSiteDataForSave(siteData, siteUpdate.urbanZone.steps);
        payload = {
          ...base,
          ...urbanZoneSiteData,
          name: urbanZoneSiteData.name ?? "",
          urbanZoneType: siteData.urbanZoneType!,
        };
        break;
      }
      default:
        throw new Error(`siteUpdateSaved: unsupported nature "${String(siteData.nature)}"`);
    }

    const validatedPayload = updateCustomSiteDtoSchema.parse(payload);
    await extra.updateSiteService.save(siteUpdate.siteId, validatedPayload);
  },
);
