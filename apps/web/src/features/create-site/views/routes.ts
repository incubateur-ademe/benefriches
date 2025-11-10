import { Route } from "type-route";

import { routes } from "@/shared/views/router";

import { SiteCreationStep } from "../core/createSite.reducer";

const SITE_CREATION_STEP_ROUTE_QUERY_STRING_MAP = {
  INTRODUCTION: "introduction",
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
} as const satisfies Record<SiteCreationStep, string>;

export const getRouteFromCreationStep = (
  step: SiteCreationStep,
): Route<typeof routes.createSite> => {
  return routes.createSite({ etape: SITE_CREATION_STEP_ROUTE_QUERY_STRING_MAP[step] });
};
