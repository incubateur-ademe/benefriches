import { Route } from "type-route";

import { routes } from "@/shared/views/router";

import { SiteCreationStep } from "../core/createSite.reducer";

const SITE_CREATION_STEP_ROUTE_QUERY_STRING_MAP = {
  INTRODUCTION: "introduction",
  CREATE_MODE_SELECTION: "mode-de-creation",
  IS_FRICHE: "est-une-friche",
  FRICHE_ACTIVITY: "type-de-friche",
  ADDRESS: "adresse",
  SOILS_INTRODUCTION: "sols-introduction",
  SURFACE_AREA: "superficie-du-site",
  SOILS_SELECTION: "sols-selection",
  SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE: "mode-renseignement-superficie-des-sols",
  SOILS_SURFACE_AREAS_DISTRIBUTION: "superficie-des-sols",
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
  YEARLY_EXPENSES: "depenses-annuelles",
  YEARLY_INCOME: "recettes-annuelles",
  YEARLY_EXPENSES_SUMMARY: "recapitulatif-depenses-annuelles",
  NAMING_INTRODUCTION: "denomination-introduction",
  NAMING: "denomination",
  FINAL_SUMMARY: "recapitulatif-final",
  CREATION_RESULT: "fin",
} as const satisfies Record<SiteCreationStep, string>;

export const getRouteFromCreationStep = (
  step: SiteCreationStep,
): Route<typeof routes.createSiteFoncier> => {
  return routes.createSiteFoncier({ etape: SITE_CREATION_STEP_ROUTE_QUERY_STRING_MAP[step] });
};
