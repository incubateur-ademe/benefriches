import type { SiteCreationCustomStep } from "@/features/create-site/core/custom/customSteps";

import AddressForm from "../common-views/address";
import AgriculturalOperationActivityForm from "../common-views/agricultural-operation-activity";
import SiteNameAndDescriptionForm from "../common-views/naming";
import SiteNamingIntroduction from "../common-views/naming/introduction";
import NaturalAreaTypeForm from "../common-views/natural-area-type";
import SiteCreationResult from "../common-views/result";
import SiteExpensesIncomeSummary from "../common-views/site-management/expenses-and-income/expenses-income-summary";
import SiteExpensesAndIncomeIntroduction from "../common-views/site-management/expenses-and-income/introduction";
import SiteYearlyExpensesForm from "../common-views/site-management/expenses-and-income/yearly-expenses";
import SiteYearlyIncomeForm from "../common-views/site-management/expenses-and-income/yearly-income";
import SiteManagementIntroduction from "../common-views/site-management/introduction";
import IsFricheLeasedForm from "../common-views/site-management/stakeholders/is-friche-leased";
import IsSiteOperatedForm from "../common-views/site-management/stakeholders/is-site-operated";
import SiteOwnerForm from "../common-views/site-management/stakeholders/owner";
import SiteOperatorForm from "../common-views/site-management/stakeholders/site-operator";
import SiteTenantForm from "../common-views/site-management/stakeholders/tenant";
import SiteSoilsCarbonStorage from "../common-views/spaces-and-soils/soils-carbon-storage";
import SiteSoilsSummary from "../common-views/spaces-and-soils/soils-summary";
import SiteSpacesDistribution from "../common-views/spaces-and-soils/spaces-distribution/distribution";
import SiteSpacesDistributionKnowledge from "../common-views/spaces-and-soils/spaces-distribution/spaces-distribution-knowledge";
import SiteSpacesIntroduction from "../common-views/spaces-and-soils/spaces-introduction";
import SpacesKnowledgeForm from "../common-views/spaces-and-soils/spaces-knowledge";
import SiteSpacesSelectionForm from "../common-views/spaces-and-soils/spaces-selection";
import SiteSurfaceAreaForm from "../common-views/spaces-and-soils/surface-area";
import SiteDataSummary from "../common-views/summary";
import FricheAccidentsForm from "../friche/accidents/accidents-count";
import FricheAccidentsIntroduction from "../friche/accidents/introduction";
import FricheActivityForm from "../friche/friche-activity";
import SoilContaminationForm from "../friche/soil-contamination";
import SoilContaminationIntroduction from "../friche/soil-contamination/introduction";
import type { StepView } from "../site-form/stepView.types";
import UrbanZoneTypeFormContainer from "../urban-zone-type";
import LandParcelsIntroductionContainer from "../urban-zone/land-parcels-introduction";

export const customStepToComponent: Record<SiteCreationCustomStep, StepView> = {
  // Never actually reached through this map: SiteCreationWizard.tsx intercepts URBAN_ZONE_TYPE
  // ahead of SiteCreationCustomStepContent and renders it with a dedicated single-step stepper
  // (see URBAN_ZONE_TYPE_STEP_TITLE there). Present here only so the Record type stays exhaustive.
  URBAN_ZONE_TYPE: { htmlTitle: "Type de zone urbaine", Component: UrbanZoneTypeFormContainer },
  FRICHE_ACTIVITY: { htmlTitle: "Ancienne activité", Component: FricheActivityForm },
  AGRICULTURAL_OPERATION_ACTIVITY: {
    htmlTitle: "Type d'exploitation",
    Component: AgriculturalOperationActivityForm,
  },
  NATURAL_AREA_TYPE: { htmlTitle: "Type d'espace naturel", Component: NaturalAreaTypeForm },
  ADDRESS: { htmlTitle: "Adresse", Component: AddressForm },
  URBAN_ZONE_LAND_PARCELS_INTRODUCTION: {
    htmlTitle: "Introduction - Surfaces foncières",
    Component: LandParcelsIntroductionContainer,
  },
  SPACES_INTRODUCTION: { htmlTitle: "Introduction - Espaces", Component: SiteSpacesIntroduction },
  SURFACE_AREA: { htmlTitle: "Surface - Espaces", Component: SiteSurfaceAreaForm },
  SPACES_KNOWLEDGE: { htmlTitle: "Type de saisie - Espaces", Component: SpacesKnowledgeForm },
  SPACES_SELECTION: { htmlTitle: "Sélection - Espaces", Component: SiteSpacesSelectionForm },
  SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE: {
    htmlTitle: "Type de saisie pour la distribution des surfaces - Espaces",
    Component: SiteSpacesDistributionKnowledge,
  },
  SPACES_SURFACE_AREA_DISTRIBUTION: {
    htmlTitle: "Distribution des surfaces - Espaces",
    Component: SiteSpacesDistribution,
  },
  SOILS_SUMMARY: { htmlTitle: "Récapitulatif des surfaces - Espaces", Component: SiteSoilsSummary },
  SOILS_CARBON_STORAGE: {
    htmlTitle: "Stockage du carbone - Espaces",
    Component: SiteSoilsCarbonStorage,
  },
  SOILS_CONTAMINATION_INTRODUCTION: {
    htmlTitle: "Introduction - Pollution",
    Component: SoilContaminationIntroduction,
  },
  SOILS_CONTAMINATION: { htmlTitle: "Surface - Pollution", Component: SoilContaminationForm },
  FRICHE_ACCIDENTS_INTRODUCTION: {
    htmlTitle: "Introduction - Accidents",
    Component: FricheAccidentsIntroduction,
  },
  FRICHE_ACCIDENTS: { htmlTitle: "Nombre - Accidents", Component: FricheAccidentsForm },
  MANAGEMENT_INTRODUCTION: {
    htmlTitle: "Introduction - Gestion",
    Component: SiteManagementIntroduction,
  },
  OWNER: { htmlTitle: "Propriétaire - Gestion", Component: SiteOwnerForm },
  IS_FRICHE_LEASED: { htmlTitle: "Location - Gestion", Component: IsFricheLeasedForm },
  IS_SITE_OPERATED: { htmlTitle: "Exploitation - Gestion", Component: IsSiteOperatedForm },
  OPERATOR: { htmlTitle: "Exploitant - Gestion", Component: SiteOperatorForm },
  TENANT: { htmlTitle: "Locataire - Gestion", Component: SiteTenantForm },
  YEARLY_EXPENSES_AND_INCOME_INTRODUCTION: {
    htmlTitle: "Introduction - Dépenses et revenus",
    Component: SiteExpensesAndIncomeIntroduction,
  },
  YEARLY_EXPENSES: {
    htmlTitle: "Dépenses annuelles - Dépenses et revenus",
    Component: SiteYearlyExpensesForm,
  },
  YEARLY_INCOME: {
    htmlTitle: "Revenus annuels - Dépenses et revenus",
    Component: SiteYearlyIncomeForm,
  },
  YEARLY_EXPENSES_SUMMARY: {
    htmlTitle: "Récapitulatif - Dépenses et revenus",
    Component: SiteExpensesIncomeSummary,
  },
  NAMING_INTRODUCTION: {
    htmlTitle: "Introduction - Dénomination",
    Component: SiteNamingIntroduction,
  },
  NAMING: { htmlTitle: "Nom et description - Dénomination", Component: SiteNameAndDescriptionForm },
  FINAL_SUMMARY: { htmlTitle: "Récapitulatif", Component: SiteDataSummary },
  CREATION_RESULT: { htmlTitle: "Résultat", Component: SiteCreationResult },
};
