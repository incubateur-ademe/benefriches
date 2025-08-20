import { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getLabelForYearlyBuildingsOperationsRevenues,
  URBAN_PROJECT_PHASE_VALUES,
  YearlyBuildingsOperationsRevenues,
} from "shared";

import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import {
  selectSiteContaminatedSurfaceArea,
  selectSiteSoilsDistribution,
  selectSiteSurfaceArea,
} from "@/features/create-project/core/createProject.selectors";
import {
  getUrbanProjectAvailableStakeholders,
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
} from "@/features/create-project/core/urban-project-event-sourcing/stakeholders.selectors";
import {
  completeStep,
  loadStep,
  navigateToPrevious,
} from "@/features/create-project/core/urban-project-event-sourcing/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-event-sourcing/urbanProject.selectors";
import {
  AnswersByStep,
  AnswerStepId,
} from "@/features/create-project/core/urban-project-event-sourcing/urbanProjectSteps";
import { getSurfaceAreaDistributionWithUnit } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { computePercentage } from "@/shared/core/percentage/percentage";
import {
  getHintTextForUrbanProjectPhase,
  getLabelForUrbanProjectPhase,
  getPictogramForProjectPhase,
} from "@/shared/core/projectPhase";
import { RootState } from "@/shared/core/store-config/store";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import {
  mapFormValuesToReinstatementExpenses,
  mapReinstatementExpensesToFormValues,
} from "../../../common-views/expenses/reinstatement/mappers";
import {
  mapExpensesToFormValues,
  mapFormValuesToExpenses,
} from "../../custom-forms/expenses/installation/mappers";
import { HTML_URBAN_PROJECT_FORM_MAIN_TITLE } from "../../htmlTitle";

const BuildingsFloorSurfaceArea = lazy(
  () => import("../../custom-forms/buildings/floor-surface-area/BuildingsFloorSurfaceArea"),
);
const BuildingsUseSurfaceAreas = lazy(
  () => import("../../custom-forms/buildings/use-surface-areas/BuildingsUseSurfaceAreas"),
);
const InstallationExpensesForm = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/expenses/installation-expenses/InstallationExpensesForm"
    ),
);
const ReinstatementExpensesForm = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/expenses/reinstatement/ReinstatementExpensesForm"
    ),
);
const SitePurchaseAmounts = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/expenses/site-purchase-amounts/SitePurchaseAmountsForm"
    ),
);
const YearlyProjectedExpensesForm = lazy(
  () =>
    import("../../custom-forms/expenses/yearly-projected-costs/BuildingsOperationsExpensesForm"),
);
const ProjectNameAndDescriptionForm = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/name-and-description/ProjectNameAndDescriptionForm"
    ),
);
const ProjectPhaseForm = lazy(
  () => import("@/features/create-project/views/common-views/project-phase/ProjectPhaseForm"),
);
const BuildingsResaleRevenueForm = lazy(
  () => import("../../custom-forms/revenues/buildings-resale/BuildingsResaleRevenueForm"),
);
const ProjectFinancialAssistanceRevenueForm = lazy(
  () => import("@/features/create-project/views/common-views/revenues/financial-assistance/"),
);
const SiteResaleRevenueForm = lazy(
  () => import("../../custom-forms/revenues/site-resale/SiteResaleRevenueForm"),
);
const ProjectYearlyRevenuesForm = lazy(
  () => import("../../../common-views/revenues/yearly-projected-revenue/ProjectYearlyRevenueForm"),
);
const ScheduleProjectionForm = lazy(
  () => import("@/features/create-project/views/common-views/schedule/projection/"),
);
const BuildingsResaleForm = lazy(
  () => import("../../custom-forms/site-resale/buildings-resale/BuildingsResaleForm"),
);
const SiteResaleForm = lazy(
  () => import("../../custom-forms/site-resale/selection/SiteResaleForm"),
);
const SoilsDecontaminationSelection = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/soils-decontamination/selection/SoilsDecontaminationSelection"
    ),
);
const SoilsDecontaminationSurfaceArea = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea"
    ),
);
const UrbanGreenSpacesDistribution = lazy(
  () =>
    import(
      "../../custom-forms/spaces/green-spaces/surface-area-distribution/UrbanGreenSpacesDistribution"
    ),
);
const LivingAndActivitySpacesDistribution = lazy(
  () =>
    import(
      "../../custom-forms/spaces/living-and-activity-spaces/surface-area-distribution/LivingAndActivitySpacesDistribution"
    ),
);
const PublicSpacesDistribution = lazy(
  () =>
    import(
      "../../custom-forms/spaces/public-spaces/surface-area-distribution/PublicSpacesDistribution"
    ),
);
const SpacesCategoriesSelection = lazy(
  () => import("../../custom-forms/spaces/selection/SpacesCategoriesSelection"),
);
const UrbanProjectSpaceCategoriesSurfaceAreaDistribution = lazy(
  () =>
    import("../../custom-forms/spaces/surface-area/SpacesCategoriesSurfaceAreaDistributionForm"),
);
const StakeholderForm = lazy(
  () => import("@/features/create-project/views/common-views/stakeholder-form"),
);

const SpacesCategoriesSelectionWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const { spacesCategories } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION")) ?? {};

  return (
    <SpacesCategoriesSelection
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: formData.spaceCategories },
          }),
        );
      }}
      onBack={onBack}
      initialValues={spacesCategories ?? []}
    />
  );
};

const SpacesCategoriesSurfaceAreaWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();

  const totalSiteSurfaceArea = useAppSelector(selectSiteSurfaceArea);

  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};
  const { spacesCategories } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION")) ?? {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    spacesCategoriesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(spacesCategoriesDistribution, "percentage").value
      : (spacesCategoriesDistribution ?? {});

  return (
    <UrbanProjectSpaceCategoriesSurfaceAreaDistribution
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
            answers: { spacesCategoriesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      initialValues={initialValues}
      totalSurfaceArea={totalSiteSurfaceArea}
      spacesCategories={spacesCategories ?? []}
    />
  );
};

const GreenSpacesDistributionWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();

  const { greenSpacesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION")) ?? {};
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    greenSpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(greenSpacesDistribution, "percentage").value
      : (greenSpacesDistribution ?? {});

  return (
    <UrbanGreenSpacesDistribution
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            answers: { greenSpacesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.GREEN_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
};

const LivingAndActivitySpacesDistributionWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();

  const { livingAndActivitySpacesDistribution } =
    useAppSelector(
      selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
    ) ?? {};
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    livingAndActivitySpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(livingAndActivitySpacesDistribution, "percentage").value
      : (livingAndActivitySpacesDistribution ?? {});

  return (
    <LivingAndActivitySpacesDistribution
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            answers: { livingAndActivitySpacesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
};

const PublicSpacesDistributionWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();

  const { publicSpacesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION")) ?? {};
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    publicSpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(publicSpacesDistribution, "percentage").value
      : (publicSpacesDistribution ?? {});

  return (
    <PublicSpacesDistribution
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
            answers: { publicSpacesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.PUBLIC_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
};

const SoilsDecontaminationSelectionWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION"),
  );
  return (
    <SoilsDecontaminationSelection
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: {
              decontaminationPlan: formData.decontaminationSelection ?? "unknown",
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        decontaminationSelection: stepAnswers?.decontaminationPlan ?? null,
      }}
    />
  );
};

const SoilsDecontaminationSurfaceAreaWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"),
  );
  const siteContaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationSurfaceArea
      contaminatedSoilSurface={siteContaminatedSurfaceArea}
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
            answers: { decontaminatedSurfaceArea: formData },
          }),
        );
      }}
      onBack={onBack}
      initialValues={
        stepAnswers?.decontaminatedSurfaceArea
          ? {
              percentSurfaceArea: computePercentage(
                stepAnswers.decontaminatedSurfaceArea,
                siteContaminatedSurfaceArea,
              ),
            }
          : undefined
      }
    />
  );
};

const BuildingsFloorSurfaceAreaWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const { buildingsFloorSurfaceArea } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA")) ?? {};
  const { livingAndActivitySpacesDistribution } =
    useAppSelector(
      selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
    ) ?? {};

  return (
    <BuildingsFloorSurfaceArea
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
            answers: { buildingsFloorSurfaceArea: formData.surfaceArea },
          }),
        );
      }}
      onBack={onBack}
      buildingsFootprintSurfaceArea={livingAndActivitySpacesDistribution?.BUILDINGS ?? 0}
      initialValues={
        buildingsFloorSurfaceArea ? { surfaceArea: buildingsFloorSurfaceArea } : undefined
      }
    />
  );
};

const BuildingsUseSurfaceAreasWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();

  const { buildingsFloorSurfaceArea } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA")) ?? {};

  const { buildingsUsesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION")) ??
    {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    buildingsUsesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(buildingsUsesDistribution, "percentage").value
      : (buildingsUsesDistribution ?? {});

  return (
    <BuildingsUseSurfaceAreas
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
            answers: { buildingsUsesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      totalSurfaceArea={buildingsFloorSurfaceArea ?? 0}
      initialValues={initialValues}
    />
  );
};

const ProjectDeveloperStakeholderWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const availableStakeholdersList = useAppSelector(getUrbanProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER"),
  );

  return (
    <StakeholderForm
      title="Qui sera l'aménageur du site ?"
      instructions={
        <FormInfo>
          <p>
            L'aménageur est l'acteur qui va engager la reconversion du site. Le bilan économique de
            l'opération sera donc à sa charge.
          </p>
        </FormInfo>
      }
      initialValues={stepAnswers?.projectDeveloper}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
            answers: { projectDeveloper: formData },
          }),
        );
      }}
      onBack={onBack}
    />
  );
};

const ReinstatementContractOwnerStakeholderWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();

  const availableStakeholdersList = useAppSelector(getUrbanProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );

  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"),
  );

  return (
    <StakeholderForm
      initialValues={stepAnswers?.reinstatementContractOwner}
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
            answers: { reinstatementContractOwner: formData },
          }),
        );
      }}
      title="Qui sera le maître d'ouvrage des travaux de remise en état de la friche ?"
      instructions={
        <FormInfo>
          <p>
            Les travaux de remise en état incluent la désimperméabilisation des sols, la
            dépollution, l'enlèvement des déchets, la déconstruction, etc.
          </p>
        </FormInfo>
      }
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
};

const SiteResaleSelectionWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const { siteResalePlannedAfterDevelopment } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SITE_RESALE_SELECTION")) ?? {};

  return (
    <SiteResaleForm
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
            answers: {
              siteResalePlannedAfterDevelopment: formData.siteResalePlanned === "yes",
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={
        siteResalePlannedAfterDevelopment === undefined
          ? undefined
          : { siteResalePlanned: siteResalePlannedAfterDevelopment ? "yes" : "no" }
      }
    />
  );
};

const BuildingsResaleSelectionWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const { buildingsResalePlannedAfterDevelopment } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION")) ?? {};

  return (
    <BuildingsResaleForm
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
            answers: {
              buildingsResalePlannedAfterDevelopment: formData.buildingsResalePlanned === "yes",
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={
        buildingsResalePlannedAfterDevelopment === undefined
          ? undefined
          : { buildingsResalePlanned: buildingsResalePlannedAfterDevelopment ? "yes" : "no" }
      }
    />
  );
};

const SitePurchaseAmountsWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS"),
  );

  return (
    <SitePurchaseAmounts
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
            answers: {
              sitePurchasePropertyTransferDuties: formData.propertyTransferDuties,
              sitePurchaseSellingPrice: formData.sellingPrice,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        sellingPrice: stepAnswers?.sitePurchaseSellingPrice,
        propertyTransferDuties: stepAnswers?.sitePurchasePropertyTransferDuties,
      }}
    />
  );
};

const InstallationExpensesWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_EXPENSES_INSTALLATION"));

  return (
    <InstallationExpensesForm
      title="Dépenses d'aménagement du site"
      labels={{
        worksAmount: "Travaux d'aménagement",
        otherAmount: "Autres dépenses d'aménagement",
      }}
      instructions={
        <FormInfo>
          <p>
            Les montants sont exprimés en <strong>€ HT</strong>.
          </p>
          <p>
            Montants calculés d'après les informations que vous avez renseignées et les dépenses
            financiers moyens en France de chaque poste de dépense.
          </p>
          <p>Vous pouvez modifier ces montants.</p>
        </FormInfo>
      }
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
            answers: {
              installationExpenses: mapFormValuesToExpenses(formData),
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={mapExpensesToFormValues(stepAnswers?.installationExpenses ?? [])}
    />
  );
};

const ProjectedBuildingsOperatingExpensesWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"),
  );

  return (
    <YearlyProjectedExpensesForm
      initialValues={{
        maintenance: stepAnswers?.yearlyProjectedBuildingsOperationsExpenses?.find(
          ({ purpose }) => purpose === "maintenance",
        )?.amount,
        taxes: stepAnswers?.yearlyProjectedBuildingsOperationsExpenses?.find(
          ({ purpose }) => purpose === "taxes",
        )?.amount,
        other: stepAnswers?.yearlyProjectedBuildingsOperationsExpenses?.find(
          ({ purpose }) => purpose === "other",
        )?.amount,
      }}
      onSubmit={(formData) => {
        const expenses = (
          [
            { purpose: "maintenance", amount: formData.maintenance ?? 0 },
            { purpose: "taxes", amount: formData.taxes ?? 0 },
            { purpose: "other", amount: formData.other ?? 0 },
          ] as const
        ).filter(({ amount }) => amount > 0);
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
            answers: {
              yearlyProjectedBuildingsOperationsExpenses: expenses,
            },
          }),
        );
      }}
      onBack={onBack}
    />
  );
};

const ReinstatementExpensesWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const { reinstatementExpenses } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_EXPENSES_REINSTATEMENT")) ?? {};
  const { decontaminatedSurfaceArea } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA")) ?? {};
  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);

  return (
    <ReinstatementExpensesForm
      onBack={onBack}
      onSubmit={(data) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
            answers: {
              reinstatementExpenses: mapFormValuesToReinstatementExpenses(data),
            },
          }),
        );
      }}
      hasBuildings={Boolean(siteSoilsDistribution.BUILDINGS && siteSoilsDistribution.BUILDINGS > 0)}
      hasProjectedDecontamination={Boolean(
        decontaminatedSurfaceArea && decontaminatedSurfaceArea > 0,
      )}
      hasImpermeableSoils={
        Boolean(
          siteSoilsDistribution.IMPERMEABLE_SOILS && siteSoilsDistribution.IMPERMEABLE_SOILS > 0,
        ) || Boolean(siteSoilsDistribution.MINERAL_SOIL && siteSoilsDistribution.MINERAL_SOIL > 0)
      }
      initialValues={
        reinstatementExpenses
          ? mapReinstatementExpensesToFormValues(reinstatementExpenses)
          : undefined
      }
    />
  );
};

const FinancialAssistanceRevenueWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE"),
  );

  return (
    <ProjectFinancialAssistanceRevenueForm
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
            answers: {
              financialAssistanceRevenues: formData,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        publicSubsidies:
          stepAnswers?.financialAssistanceRevenues?.find(
            ({ source }) => source === "public_subsidies",
          )?.amount ?? 0,
        localOrRegionalAuthority:
          stepAnswers?.financialAssistanceRevenues?.find(
            ({ source }) => source === "local_or_regional_authority_participation",
          )?.amount ?? 0,
        other:
          stepAnswers?.financialAssistanceRevenues?.find(({ source }) => source === "other")
            ?.amount ?? 0,
      }}
    />
  );
};

const fields = ["rent", "other"] as const;
const YearlyRevenuesWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"),
  );

  return (
    <ProjectYearlyRevenuesForm
      title="Recettes annuelles d'exploitation des bâtiments"
      instructions={
        <p>
          Les montants sont exprimés en <strong>€ HT</strong>.
        </p>
      }
      fields={fields}
      getFieldLabel={getLabelForYearlyBuildingsOperationsRevenues as (field: string) => string}
      onSubmit={(formData) => {
        const revenues: YearlyBuildingsOperationsRevenues[] = [];
        for (const field of fields) {
          if (formData[field]) {
            revenues.push({
              source: field,
              amount: formData[field],
            });
          }
        }
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
            answers: {
              yearlyProjectedRevenues: revenues,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        rent:
          stepAnswers?.yearlyProjectedRevenues?.find(({ source }) => source === "rent")?.amount ??
          0,
        other:
          stepAnswers?.yearlyProjectedRevenues?.find(({ source }) => source === "other")?.amount ??
          0,
      }}
    />
  );
};

const SiteResaleRevenueWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"),
  );

  return (
    <SiteResaleRevenueForm
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
            answers: {
              siteResaleExpectedSellingPrice: formData.sellingPrice,
              siteResaleExpectedPropertyTransferDuties: formData.propertyTransferDuties,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        sellingPrice: stepAnswers?.siteResaleExpectedSellingPrice,
        propertyTransferDuties: stepAnswers?.siteResaleExpectedPropertyTransferDuties,
      }}
    />
  );
};

const BuildingsResaleRevenueWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE"));

  return (
    <BuildingsResaleRevenueForm
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
            answers: {
              buildingsResaleSellingPrice: formData.sellingPrice,
              buildingsResalePropertyTransferDuties: formData.propertyTransferDuties,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        sellingPrice: stepAnswers?.buildingsResaleSellingPrice,
        propertyTransferDuties: stepAnswers?.buildingsResalePropertyTransferDuties,
      }}
    />
  );
};

const ScheduleProjectionWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_SCHEDULE_PROJECTION"));

  return (
    <ScheduleProjectionForm
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION",
            answers: {
              installationSchedule: formData.installationSchedule,
              reinstatementSchedule: formData.reinstatementSchedule,
              firstYearOfOperation: formData.firstYearOfOperation,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={
        stepAnswers?.installationSchedule && stepAnswers.firstYearOfOperation
          ? {
              installation: {
                startDate: new Date(stepAnswers.installationSchedule.startDate),
                endDate: new Date(stepAnswers.installationSchedule.endDate),
              },
              reinstatement: stepAnswers.reinstatementSchedule
                ? {
                    startDate: new Date(stepAnswers.reinstatementSchedule.startDate),
                    endDate: new Date(stepAnswers.reinstatementSchedule.endDate),
                  }
                : undefined,
              firstYearOfOperations: stepAnswers.firstYearOfOperation,
            }
          : undefined
      }
    />
  );
};

const ProjectPhaseWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_PROJECT_PHASE"));

  return (
    <ProjectPhaseForm
      projectPhaseOptions={URBAN_PROJECT_PHASE_VALUES.map((phase) => ({
        value: phase,
        label: getLabelForUrbanProjectPhase(phase),
        hintText: getHintTextForUrbanProjectPhase(phase),
        pictogram: getPictogramForProjectPhase(phase),
      }))}
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_PROJECT_PHASE",
            answers: {
              projectPhase:
                formData.phase as AnswersByStep["URBAN_PROJECT_PROJECT_PHASE"]["projectPhase"],
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{ phase: stepAnswers?.projectPhase }}
    />
  );
};

const ProjectNamingWrapper = ({ onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_NAMING"));

  return (
    <ProjectNameAndDescriptionForm
      onSubmit={(formData) => {
        dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_NAMING",
            answers: {
              name: formData.name,
              description: formData.description,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        name: stepAnswers?.name ?? "",
        description: stepAnswers?.description,
      }}
    />
  );
};

type StepComponentProps = {
  onBack: () => void;
};

interface StepConfig {
  htmlTitle: string;
  Component: React.ComponentType<StepComponentProps>;
}

const STEP_CONFIGS: Record<AnswerStepId, StepConfig> = {
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
    htmlTitle: `Sélection - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SpacesCategoriesSelectionWrapper,
  },
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
    htmlTitle: `Répartition - Espaces  - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SpacesCategoriesSurfaceAreaWrapper,
  },
  URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: {
    htmlTitle: `Répartition - Espaces verts - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: GreenSpacesDistributionWrapper,
  },
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
    htmlTitle: `Répartition - Lieux d'habitation et d'activité - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: LivingAndActivitySpacesDistributionWrapper,
  },
  URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: {
    htmlTitle: `Répartition - Espaces publics - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: PublicSpacesDistributionWrapper,
  },
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
    htmlTitle: `Mode de saisie - Dépollution - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SoilsDecontaminationSelectionWrapper,
  },
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
    htmlTitle: `Surface - Dépollution - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SoilsDecontaminationSurfaceAreaWrapper,
  },
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: {
    htmlTitle: `Surfaces - Bâtiments - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: BuildingsFloorSurfaceAreaWrapper,
  },
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
    htmlTitle: `Répartition - Usages - Bâtiments - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: BuildingsUseSurfaceAreasWrapper,
  },
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
    htmlTitle: `Aménageur - Acteurs - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectDeveloperStakeholderWrapper,
  },
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
    htmlTitle: `Maître d'ouvrage de la réhabilitation - Acteurs - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ReinstatementContractOwnerStakeholderWrapper,
  },
  URBAN_PROJECT_SITE_RESALE_SELECTION: {
    htmlTitle: `Sélection - Revente - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SiteResaleSelectionWrapper,
  },
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
    htmlTitle: `Sélection - Revente des bâtiments - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: BuildingsResaleSelectionWrapper,
  },
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: {
    htmlTitle: `Achat du site - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SitePurchaseAmountsWrapper,
  },
  URBAN_PROJECT_EXPENSES_INSTALLATION: {
    htmlTitle: `Aménagement - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: InstallationExpensesWrapper,
  },
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
    htmlTitle: `Exploitation - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectedBuildingsOperatingExpensesWrapper,
  },
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
    htmlTitle: `Remise en état - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ReinstatementExpensesWrapper,
  },
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: {
    htmlTitle: `Aides financières - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: FinancialAssistanceRevenueWrapper,
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: {
    htmlTitle: `Exploitation - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: YearlyRevenuesWrapper,
  },
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
    htmlTitle: `Revente du site - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SiteResaleRevenueWrapper,
  },
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
    htmlTitle: `Revente des bâtiments - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: BuildingsResaleRevenueWrapper,
  },
  URBAN_PROJECT_SCHEDULE_PROJECTION: {
    htmlTitle: `Saisie - Calendrier - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ScheduleProjectionWrapper,
  },
  URBAN_PROJECT_PROJECT_PHASE: {
    htmlTitle: `Avancement - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectPhaseWrapper,
  },
  URBAN_PROJECT_NAMING: {
    htmlTitle: `Dénomination - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectNamingWrapper,
  },
};

type Props = {
  currentStep: AnswerStepId;
};

export default function AnswerStepWizard({ currentStep }: Props) {
  const dispatch = useAppDispatch();

  const isStepLoading = useSelector(
    (state: RootState) => state.projectCreation.urbanProjectEventSourcing.isStepLoading,
  );

  useEffect(() => {
    dispatch(loadStep({ stepId: currentStep }));
  }, [currentStep, dispatch]);

  const onBack = () => {
    dispatch(navigateToPrevious({ stepId: currentStep }));
  };

  if (isStepLoading) {
    return <LoadingSpinner />;
  }

  const stepConfig = STEP_CONFIGS[currentStep];
  const { htmlTitle, Component } = stepConfig;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HtmlTitle>{htmlTitle}</HtmlTitle>
      <Component onBack={onBack} />
    </Suspense>
  );
}
