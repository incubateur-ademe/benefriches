import { lazy, ReactNode } from "react";

import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

const BuildingsIntroduction = lazy(
  () => import("@/features/create-project/views/urban-project/buildings/introduction"),
);
const BuildingsReuseIntroduction = lazy(
  () => import("@/features/create-project/views/urban-project/buildings/reuse-introduction"),
);
const BuildingsNewConstructionIntroduction = lazy(
  () =>
    import("@/features/create-project/views/urban-project/buildings/new-construction-introduction"),
);
const BuildingsFootprintToReuse = lazy(
  () => import("@/features/create-project/views/urban-project/buildings/footprint-to-reuse"),
);
const BuildingsDemolitionInfo = lazy(
  () => import("@/features/create-project/views/urban-project/buildings/demolition-info"),
);
const ExistingBuildingsUsesFloorSurfaceArea = lazy(
  () =>
    import("@/features/create-project/views/urban-project/buildings/existing-buildings-uses-floor-surface-area"),
);
const BuildingsNewConstructionInfo = lazy(
  () => import("@/features/create-project/views/urban-project/buildings/new-construction-info"),
);
const NewBuildingsUsesFloorSurfaceArea = lazy(
  () =>
    import("@/features/create-project/views/urban-project/buildings/new-buildings-uses-floor-surface-area"),
);
const ProjectCreationResult = lazy(() => import("./creation-result"));
const InstallationExpensesForm = lazy(
  () => import("@/features/create-project/views/urban-project/expenses/installation"),
);
const ProjectExpensesIntroduction = lazy(
  () => import("@/features/create-project/views/urban-project/expenses/introduction"),
);
const BuildingsConstructionAndRehabilitationExpensesForm = lazy(
  () =>
    import("@/features/create-project/views/urban-project/expenses/buildings-construction-and-rehabilitation"),
);
const ReinstatementExpensesForm = lazy(
  () => import("@/features/create-project/views/urban-project/expenses/reinstatement"),
);
const SitePurchaseAmounts = lazy(
  () => import("@/features/create-project/views/urban-project/expenses/site-purchase-amounts"),
);
const YearlyProjectedExpensesForm = lazy(
  () =>
    import("@/features/create-project/views/urban-project/expenses/projected-buildings-operating-expenses"),
);
const ProjectNameAndDescriptionForm = lazy(
  () => import("@/features/create-project/views/urban-project/naming"),
);
const BuildingsResaleRevenueForm = lazy(
  () => import("@/features/create-project/views/urban-project/revenues/buildings-resale"),
);
const ProjectFinancialAssistanceRevenueForm = lazy(
  () => import("@/features/create-project/views/urban-project/revenues/financial-assistance"),
);
const ProjectRevenueIntroduction = lazy(
  () => import("@/features/create-project/views/urban-project/revenues/introduction"),
);
const SiteResaleRevenueForm = lazy(
  () => import("@/features/create-project/views/urban-project/revenues/expected-site-resale"),
);
const YearlyProjectedRevenueForm = lazy(
  () =>
    import("@/features/create-project/views/urban-project/revenues/buildings-operations-yearly-revenues"),
);

const ScheduleProjectionForm = lazy(
  () => import("@/features/create-project/views/urban-project/schedule/projection"),
);
const BuildingsResaleForm = lazy(
  () =>
    import("@/features/create-project/views/urban-project/site-and-buildings-resale/buildings-resale"),
);
const SiteResaleIntroduction = lazy(
  () =>
    import("@/features/create-project/views/urban-project/site-and-buildings-resale/introduction"),
);
const SiteResaleForm = lazy(
  () => import("@/features/create-project/views/urban-project/site-and-buildings-resale/selection"),
);
const InvolvesReinstatement = lazy(
  () => import("@/features/create-project/views/urban-project/soils/involves-reinstatement"),
);
const SoilsDecontaminationIntroduction = lazy(
  () => import("@/features/create-project/views/urban-project/soils/decontamination-introduction"),
);
const SoilsDecontaminationSelection = lazy(
  () => import("@/features/create-project/views/urban-project/soils/decontamination-selection"),
);
const SoilsDecontaminationSurfaceArea = lazy(
  () => import("@/features/create-project/views/urban-project/soils/decontamination-surface-area"),
);
const UsesIntroduction = lazy(
  () => import("@/features/create-project/views/urban-project/uses/introduction"),
);
const UsesSelection = lazy(
  () => import("@/features/create-project/views/urban-project/uses/selection"),
);
const UsesFloorSurfaceArea = lazy(
  () => import("@/features/create-project/views/urban-project/buildings/uses-floor-surface-area"),
);
const PublicGreenSpacesSurfaceArea = lazy(
  () =>
    import("@/features/create-project/views/urban-project/uses/public-green-spaces-surface-area"),
);
const PublicGreenSpacesIntroduction = lazy(
  () =>
    import("@/features/create-project/views/urban-project/spaces/public-green-spaces-introduction"),
);
const PublicGreenSpacesSoilsDistribution = lazy(
  () =>
    import("@/features/create-project/views/urban-project/spaces/public-green-spaces-soils-distribution"),
);
const SpacesIntroduction = lazy(
  () => import("@/features/create-project/views/urban-project/spaces/introduction"),
);
const SpacesSelection = lazy(
  () => import("@/features/create-project/views/urban-project/spaces/selection"),
);
const SpacesSurfaceArea = lazy(
  () => import("@/features/create-project/views/urban-project/spaces/surface-area"),
);
const UrbanProjectSoilsCarbonStorage = lazy(
  () => import("@/features/create-project/views/urban-project/soils/carbon-summary"),
);
const UrbanProjectSoilsSummary = lazy(
  () => import("@/features/create-project/views/urban-project/soils/summary"),
);
const DeveloperForm = lazy(
  () => import("@/features/create-project/views/urban-project/stakeholders/project-developer"),
);
const BuildingsDeveloperForm = lazy(
  () => import("@/features/create-project/views/urban-project/stakeholders/buildings-developer"),
);
const ProjectStakeholdersIntroduction = lazy(
  () => import("@/features/create-project/views/urban-project/stakeholders/introduction"),
);
const SiteReinstatementContractOwnerForm = lazy(
  () =>
    import("@/features/create-project/views/urban-project/stakeholders/reinstatement-contract-owner"),
);
const ProjectDataSummary = lazy(
  () => import("@/features/create-project/views/urban-project/summary"),
);

export type UrbanProjectStepViewMode = "creation" | "update";

export const getUrbanProjectStepView = (
  step: UrbanProjectCreationStep,
  { mainTitle, mode }: { mainTitle: string; mode: UrbanProjectStepViewMode },
): Exclude<ReactNode, undefined> => {
  switch (step) {
    case "URBAN_PROJECT_USES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Usages - ${mainTitle}`}</HtmlTitle>
          <UsesIntroduction />
        </>
      );
    case "URBAN_PROJECT_USES_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Usages - ${mainTitle}`}</HtmlTitle>
          <UsesSelection />
        </>
      );
    case "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Superficie des espaces verts - Usages - ${mainTitle}`}</HtmlTitle>
          <PublicGreenSpacesSurfaceArea />
        </>
      );
    case "URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Liste des sols des espaces verts - ${mainTitle}`}</HtmlTitle>
          <PublicGreenSpacesIntroduction />
        </>
      );
    case "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION":
      return (
        <>
          <HtmlTitle>{`Liste des sols des espaces verts - ${mainTitle}`}</HtmlTitle>
          <PublicGreenSpacesSoilsDistribution />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surface de plancher des usages - Bâtiments - ${mainTitle}`}</HtmlTitle>
          <UsesFloorSurfaceArea />
        </>
      );
    case "URBAN_PROJECT_SPACES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>
            {mode === "update"
              ? `Introduction - Nouveaux espaces - ${mainTitle}`
              : `Introduction - Espaces - ${mainTitle}`}
          </HtmlTitle>
          <SpacesIntroduction />
        </>
      );
    case "URBAN_PROJECT_SPACES_SELECTION":
      return (
        <>
          <HtmlTitle>
            {mode === "update"
              ? `Sélection - Nouveaux espaces - ${mainTitle}`
              : `Sélection - Espaces - ${mainTitle}`}
          </HtmlTitle>
          <SpacesSelection />
        </>
      );
    case "URBAN_PROJECT_SPACES_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>
            {mode === "update"
              ? `Surfaces - Nouveaux espaces - ${mainTitle}`
              : `Répartition - Espaces - ${mainTitle}`}
          </HtmlTitle>
          <SpacesSurfaceArea />
        </>
      );
    case "URBAN_PROJECT_SPACES_SOILS_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - Espaces - ${mainTitle}`}</HtmlTitle>
          <UrbanProjectSoilsSummary />
        </>
      );
    case "URBAN_PROJECT_SOILS_CARBON_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Carbone stocké dans les sols - Espaces - ${mainTitle}`}</HtmlTitle>
          <UrbanProjectSoilsCarbonStorage />
        </>
      );
    case "URBAN_PROJECT_INVOLVES_REINSTATEMENT":
      if (mode === "update") {
        return null;
      }
      return (
        <>
          <HtmlTitle>{`Remise en état - Travaux - ${mainTitle}`}</HtmlTitle>
          <InvolvesReinstatement />
        </>
      );
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Travaux - ${mainTitle}`}</HtmlTitle>
          <SoilsDecontaminationIntroduction />
        </>
      );
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION":
      return (
        <>
          <HtmlTitle>{`Choix de dépolluer - Travaux - ${mainTitle}`}</HtmlTitle>
          <SoilsDecontaminationSelection />
        </>
      );
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surface à dépolluer - Travaux - ${mainTitle}`}</HtmlTitle>
          <SoilsDecontaminationSurfaceArea />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Bâtiments - ${mainTitle}`}</HtmlTitle>
          <BuildingsIntroduction />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Réutilisation des bâtiments - ${mainTitle}`}</HtmlTitle>
          <BuildingsReuseIntroduction />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Construction de nouveaux bâtiments - ${mainTitle}`}</HtmlTitle>
          <BuildingsNewConstructionIntroduction />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE":
      return (
        <>
          <HtmlTitle>{`Réutilisation des bâtiments - Bâtiments - ${mainTitle}`}</HtmlTitle>
          <BuildingsFootprintToReuse />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO":
      return (
        <>
          <HtmlTitle>{`Information - Démolition des bâtiments - ${mainTitle}`}</HtmlTitle>
          <BuildingsDemolitionInfo />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Usages des bâtiments existants - Bâtiments - ${mainTitle}`}</HtmlTitle>
          <ExistingBuildingsUsesFloorSurfaceArea />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO":
      return (
        <>
          <HtmlTitle>{`Information - Construction de nouveaux bâtiments - ${mainTitle}`}</HtmlTitle>
          <BuildingsNewConstructionInfo />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Usages des nouveaux bâtiments - Bâtiments - ${mainTitle}`}</HtmlTitle>
          <NewBuildingsUsesFloorSurfaceArea />
        </>
      );
    case "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER":
      return (
        <>
          <HtmlTitle>{`Constructeur des bâtiments - Acteurs - ${mainTitle}`}</HtmlTitle>
          <BuildingsDeveloperForm />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION":
      return (
        <>
          <HtmlTitle>{`Construction et réhabilitation des bâtiments - Dépenses - ${mainTitle}`}</HtmlTitle>
          <BuildingsConstructionAndRehabilitationExpensesForm />
        </>
      );
    case "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Acteurs - ${mainTitle}`}</HtmlTitle>
          <ProjectStakeholdersIntroduction />
        </>
      );
    case "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER":
      return (
        <>
          <HtmlTitle>{`Aménageur - Acteurs - ${mainTitle}`}</HtmlTitle>
          <DeveloperForm />
        </>
      );
    case "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return (
        <>
          <HtmlTitle>{`Maître d'ouvrage de la réhabilitation - Acteurs - ${mainTitle}`}</HtmlTitle>
          <SiteReinstatementContractOwnerForm />
        </>
      );
    case "URBAN_PROJECT_SITE_RESALE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Revente - ${mainTitle}`}</HtmlTitle>
          <SiteResaleIntroduction />
        </>
      );
    case "URBAN_PROJECT_SITE_RESALE_SELECTION":
      return (
        <>
          <HtmlTitle>{`Cession du site aménagé - Cession foncière - ${mainTitle}`}</HtmlTitle>
          <SiteResaleForm />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION":
      return (
        <>
          <HtmlTitle>{`Revente des bâtiments - Cession foncière - ${mainTitle}`}</HtmlTitle>
          <BuildingsResaleForm />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépenses - ${mainTitle}`}</HtmlTitle>
          <ProjectExpensesIntroduction />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS":
      return (
        <>
          <HtmlTitle>{`Acquisition foncière - Dépenses - ${mainTitle}`}</HtmlTitle>
          <SitePurchaseAmounts />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_INSTALLATION":
      return (
        <>
          <HtmlTitle>{`Aménagement du site - Dépenses - ${mainTitle}`}</HtmlTitle>
          <InstallationExpensesForm />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES":
      return (
        <>
          <HtmlTitle>{`Exploitation des bâtiments - Dépenses - ${mainTitle}`}</HtmlTitle>
          <YearlyProjectedExpensesForm />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_REINSTATEMENT":
      return (
        <>
          <HtmlTitle>{`Remise en état du site - Dépenses - ${mainTitle}`}</HtmlTitle>
          <ReinstatementExpensesForm />
        </>
      );
    case "URBAN_PROJECT_REVENUE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Recettes - ${mainTitle}`}</HtmlTitle>
          <ProjectRevenueIntroduction />
        </>
      );
    case "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE":
      return (
        <>
          <HtmlTitle>{`Aides financières - Recettes - ${mainTitle}`}</HtmlTitle>
          <ProjectFinancialAssistanceRevenueForm />
        </>
      );
    case "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES":
      return (
        <>
          <HtmlTitle>{`Exploitation des bâtiments - Recettes - ${mainTitle}`}</HtmlTitle>
          <YearlyProjectedRevenueForm />
        </>
      );
    case "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE":
      return (
        <>
          <HtmlTitle>{`Cession foncière - Recettes - ${mainTitle}`}</HtmlTitle>
          <SiteResaleRevenueForm />
        </>
      );
    case "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE":
      return (
        <>
          <HtmlTitle>{`Vente des bâtiments - Recettes - ${mainTitle}`}</HtmlTitle>
          <BuildingsResaleRevenueForm />
        </>
      );
    case "URBAN_PROJECT_SCHEDULE_PROJECTION":
      return (
        <>
          <HtmlTitle>{`Saisie - Calendrier - ${mainTitle}`}</HtmlTitle>
          <ScheduleProjectionForm />
        </>
      );
    case "URBAN_PROJECT_NAMING":
      return (
        <>
          <HtmlTitle>{`Dénomination - ${mainTitle}`}</HtmlTitle>
          <ProjectNameAndDescriptionForm />
        </>
      );
    case "URBAN_PROJECT_FINAL_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - ${mainTitle}`}</HtmlTitle>
          <ProjectDataSummary />
        </>
      );
    case "URBAN_PROJECT_CREATION_RESULT":
      return (
        <>
          <HtmlTitle>{`Résultat - ${mainTitle}`}</HtmlTitle>
          <ProjectCreationResult />
        </>
      );
  }
};
