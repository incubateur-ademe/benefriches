import { typedObjectEntries } from "shared";

import { PARCEL_STEP_IDS } from "@/features/create-site/core/urban-zone/steps/per-parcel-soils/parcelStepMapping";
import type { UrbanZoneSiteCreationStep } from "@/features/create-site/core/urban-zone/urbanZoneSteps";

import type { StepView } from "../site-form/stepView.types";
import UrbanZoneCreationResultContainer from "./creation-result";
import ExpensesAndIncomeIntroductionContainer from "./expenses-and-income-introduction";
import ExpensesAndIncomeSummaryContainer from "./expenses-and-income-summary";
import UrbanZoneFinalSummaryContainer from "./final-summary";
import FullTimeJobsEquivalentContainer from "./full-time-jobs-equivalent";
import LandParcelBuildingsFloorAreaContainer from "./land-parcel-buildings-floor-area";
import LandParcelSoilsDistributionContainer from "./land-parcel-soils-distribution";
import LandParcelsSelectionContainer from "./land-parcels-selection";
import LandParcelsSurfaceDistributionContainer from "./land-parcels-surface-distribution";
import LocalAuthorityExpensesContainer from "./local-authority-expenses";
import ManagementIntroductionContainer from "./management-introduction";
import ManagerContainer from "./manager";
import NamingContainer from "./naming";
import NamingIntroductionContainer from "./naming-introduction";
import SoilsAndSpacesIntroductionContainer from "./soils-and-spaces-introduction";
import UrbanZoneSoilsCarbonStorageContainer from "./soils-carbon-storage";
import SoilsContaminationContainer from "./soils-contamination";
import SoilsContaminationIntroductionContainer from "./soils-contamination-introduction";
import UrbanZoneSoilsSummaryContainer from "./soils-summary";
import VacantCommercialPremisesFloorAreaContainer from "./vacant-commercial-premises-floor-area";
import VacantCommercialPremisesFootprintContainer from "./vacant-commercial-premises-footprint";
import VacantPremisesExpensesContainer from "./vacant-premises-expenses";
import ZoneManagementExpensesContainer from "./zone-management-expenses";
import ZoneManagementIncomeContainer from "./zone-management-income";

// Per-parcel entries are generated from PARCEL_STEP_IDS (the static ADR-0008 step ids) rather
// than hand-listed — that keeps the map and the step-id source of truth from drifting apart.
// Each wrapper closes over a fixed `parcelType` and passes `key={parcelType}` down: react-hook-form
// only reads `defaultValues` on mount, so without a remount, moving from one parcel type to the
// next would show the previous parcel's numbers. Because the wrapper itself is a distinct
// component reference per parcel type, switching between them already forces React to unmount +
// remount the subtree — the explicit key is kept anyway to make that intent unmissable.
const perParcelStepEntries: [UrbanZoneSiteCreationStep, StepView][] = typedObjectEntries(
  PARCEL_STEP_IDS,
).flatMap(([parcelType, stepIds]): [UrbanZoneSiteCreationStep, StepView][] => [
  [
    stepIds.soilsDistribution,
    {
      htmlTitle: "Superficie des sols - Zone urbaine",
      Component: () => (
        <LandParcelSoilsDistributionContainer key={parcelType} parcelType={parcelType} />
      ),
    },
  ],
  [
    stepIds.buildingsFloorArea,
    {
      htmlTitle: "Surface de plancher - Zone urbaine",
      Component: () => (
        <LandParcelBuildingsFloorAreaContainer key={parcelType} parcelType={parcelType} />
      ),
    },
  ],
]);

const explicitUrbanZoneStepToComponent = {
  URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION: {
    htmlTitle: "Introduction - Sols et espaces",
    Component: SoilsAndSpacesIntroductionContainer,
  },
  URBAN_ZONE_LAND_PARCELS_SELECTION: {
    htmlTitle: "Surfaces foncières - Zone urbaine",
    Component: LandParcelsSelectionContainer,
  },
  URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: {
    htmlTitle: "Surfaces des parcelles - Zone urbaine",
    Component: LandParcelsSurfaceDistributionContainer,
  },
  URBAN_ZONE_SOILS_SUMMARY: {
    htmlTitle: "Récapitulatif des sols - Zone urbaine",
    Component: UrbanZoneSoilsSummaryContainer,
  },
  URBAN_ZONE_SOILS_CARBON_STORAGE: {
    htmlTitle: "Stockage du carbone par les sols - Sols et espaces - Zone urbaine",
    Component: UrbanZoneSoilsCarbonStorageContainer,
  },
  URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION: {
    htmlTitle: "Introduction - Pollution - Zone urbaine",
    Component: SoilsContaminationIntroductionContainer,
  },
  URBAN_ZONE_SOILS_CONTAMINATION: {
    htmlTitle: "Pollution des sols - Zone urbaine",
    Component: SoilsContaminationContainer,
  },
  URBAN_ZONE_MANAGEMENT_INTRODUCTION: {
    htmlTitle: "Introduction - Gestion et activité - Zone urbaine",
    Component: ManagementIntroductionContainer,
  },
  URBAN_ZONE_MANAGER: {
    htmlTitle: "Gestionnaire - Zone urbaine",
    Component: ManagerContainer,
  },
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
    htmlTitle: "Emprise foncière des locaux vacants - Zone urbaine",
    Component: VacantCommercialPremisesFootprintContainer,
  },
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: {
    htmlTitle: "Surface de plancher des locaux vacants - Zone urbaine",
    Component: VacantCommercialPremisesFloorAreaContainer,
  },
  URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: {
    htmlTitle: "Emplois en équivalent temps plein - Zone urbaine",
    Component: FullTimeJobsEquivalentContainer,
  },
  URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION: {
    htmlTitle: "Introduction - Dépenses et recettes - Zone urbaine",
    Component: ExpensesAndIncomeIntroductionContainer,
  },
  URBAN_ZONE_VACANT_PREMISES_EXPENSES: {
    htmlTitle: "Dépenses locaux vacants - Zone urbaine",
    Component: VacantPremisesExpensesContainer,
  },
  URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES: {
    htmlTitle: "Dépenses de gestion - Zone urbaine",
    Component: ZoneManagementExpensesContainer,
  },
  URBAN_ZONE_ZONE_MANAGEMENT_INCOME: {
    htmlTitle: "Recettes - Zone urbaine",
    Component: ZoneManagementIncomeContainer,
  },
  URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY: {
    htmlTitle: "Récapitulatif dépenses et recettes - Zone urbaine",
    Component: ExpensesAndIncomeSummaryContainer,
  },
  URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES: {
    htmlTitle: "Dépenses collectivité - Zone urbaine",
    Component: LocalAuthorityExpensesContainer,
  },
  URBAN_ZONE_NAMING_INTRODUCTION: {
    htmlTitle: "Introduction - Dénomination - Zone urbaine",
    Component: NamingIntroductionContainer,
  },
  URBAN_ZONE_NAMING: {
    htmlTitle: "Dénomination du site - Zone urbaine",
    Component: NamingContainer,
  },
  URBAN_ZONE_FINAL_SUMMARY: {
    htmlTitle: "Récapitulatif - Zone urbaine",
    Component: UrbanZoneFinalSummaryContainer,
  },
  URBAN_ZONE_CREATION_RESULT: {
    htmlTitle: "Création du site - Zone urbaine",
    Component: UrbanZoneCreationResultContainer,
  },
};

// The per-parcel entries are generated (see perParcelStepEntries above), so their coverage of
// UrbanZoneSiteCreationStep isn't provable at the type level from an object-literal spread —
// `stepToComponent.spec.ts` is the runtime guard that the merged map covers every step id.
export const urbanZoneStepToComponent = {
  ...explicitUrbanZoneStepToComponent,
  ...Object.fromEntries(perParcelStepEntries),
} as unknown as Record<UrbanZoneSiteCreationStep, StepView>;
