import { Route } from "type-route";

import { routes } from "@/app/router";

import { SiteCreationStep } from "../core/createSite.reducer";

const SITE_CREATION_STEP_ROUTE_QUERY_STRING_MAP = {
  INTRODUCTION: "introduction",
  USE_MUTABILITY: "mode-evaluation",
  CREATE_MODE_SELECTION: "mode-de-creation",
  IS_FRICHE: "est-une-friche",
  SITE_NATURE: "nature-du-site",
  FRICHE_ACTIVITY: "type-de-friche",
  AGRICULTURAL_OPERATION_ACTIVITY: "activite-agricole",
  NATURAL_AREA_TYPE: "type-espace-naturel",
  ADDRESS: "adresse",
  SPACES_INTRODUCTION: "espaces-introduction",
  SURFACE_AREA: "superficie-du-site",
  SPACES_KNOWLEDGE: "connaissance-des-espaces",
  SPACES_SELECTION: "selection-des-espaces",
  SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE: "connaissance-superficie-des-espaces",
  SPACES_SURFACE_AREA_DISTRIBUTION: "superficie-des-espaces",
  SOILS_SUMMARY: "recapitulatif-des-sols",
  SOILS_CARBON_STORAGE: "stockage-carbone-par-les-sols",
  SOILS_CONTAMINATION_INTRODUCTION: "pollution-introduction",
  SOILS_CONTAMINATION: "pollution-superficie",
  FRICHE_ACCIDENTS_INTRODUCTION: "accidents-introduction",
  FRICHE_ACCIDENTS: "accidents-details",
  MANAGEMENT_INTRODUCTION: "gestion-du-site-introduction",
  OWNER: "proprietaire",
  IS_FRICHE_LEASED: "friche-est-louee",
  IS_SITE_OPERATED: "site-est-exploite",
  TENANT: "locataire",
  OPERATOR: "exploitant",
  YEARLY_EXPENSES_AND_INCOME_INTRODUCTION: "introduction-depenses-et-recettes-annuelles",
  YEARLY_EXPENSES: "depenses-annuelles",
  YEARLY_INCOME: "recettes-annuelles",
  YEARLY_EXPENSES_SUMMARY: "recapitulatif-depenses-annuelles",
  NAMING_INTRODUCTION: "denomination-introduction",
  NAMING: "denomination",
  FINAL_SUMMARY: "recapitulatif-final",
  CREATION_RESULT: "fin",
  // urban zone old-pattern step
  URBAN_ZONE_TYPE: "type-de-zone-urbaine",
  // urban zone step handler steps
  URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION: "zone-urbaine-pollution-introduction",
  URBAN_ZONE_MANAGEMENT_INTRODUCTION: "zone-urbaine-gestion-introduction",
  URBAN_ZONE_NAMING_INTRODUCTION: "zone-urbaine-denomination-introduction",
  URBAN_ZONE_SOILS_SUMMARY: "zone-urbaine-recapitulatif-sols",
  URBAN_ZONE_FINAL_SUMMARY: "zone-urbaine-recapitulatif",
  URBAN_ZONE_CREATION_RESULT: "zone-urbaine-fin",
  URBAN_ZONE_LAND_PARCELS_SELECTION: "zone-urbaine-selection-surfaces-foncieres",
  URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: "zone-urbaine-superficie-surfaces-foncieres",
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: "zone-urbaine-sols-activite-commerciale",
  URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: "zone-urbaine-sols-espaces-publics",
  URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION: "zone-urbaine-sols-surface-viabilisee",
  URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION: "zone-urbaine-sols-surface-reservee",
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA:
    "zone-urbaine-plancher-activite-commerciale",
  URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA: "zone-urbaine-plancher-espaces-publics",
  URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA: "zone-urbaine-plancher-surface-viabilisee",
  URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA: "zone-urbaine-plancher-surface-reservee",
  URBAN_ZONE_SOILS_CONTAMINATION: "zone-urbaine-pollution",
  URBAN_ZONE_MANAGER: "zone-urbaine-gestionnaire",
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: "zone-urbaine-emprise-locaux-vacants",
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: "zone-urbaine-surface-locaux-vacants",
  URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: "zone-urbaine-emplois-temps-plein",
  URBAN_ZONE_NAMING: "zone-urbaine-denomination",
} as const satisfies Record<SiteCreationStep, string>;

export const getRouteFromCreationStep = (
  step: SiteCreationStep,
): Route<typeof routes.createSite> => {
  return routes.createSite({ etape: SITE_CREATION_STEP_ROUTE_QUERY_STRING_MAP[step] });
};
