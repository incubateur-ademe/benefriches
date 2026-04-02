import { useCallback } from "react";
import {
  ReconversionProjectSoilsDistribution,
  roundToInteger,
  sumListWithKey,
  typedObjectEntries,
} from "shared";

import { getLabelForUrbanProjectUse } from "@/features/create-project/core/urban-project/urbanProject";
import { getLabelForSpace } from "@/features/create-project/core/urban-project/urbanProject";
import { getLabelForDevelopmentPlanCategory } from "@/features/create-project/views/projectTypeLabelMapping";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getProjectSummary } from "@/shared/core/reducers/project-form/urban-project/helpers/projectSummary";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { getLabelForBuildingsUse } from "@/shared/core/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import ScheduleDates from "@/shared/views/components/FeaturesList/FeaturesListScheduleDates";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import WizardFormLayout, {
  WizardFormLayoutProps,
} from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { ProjectStepGroups } from "../../stepper/stepperConfig";
import UrbanProjectExpensesSection from "./UrbanProjectExpensesSection";
import UrbanProjectRevenuesSection from "./UrbanProjectRevenuesSection";

type UrbanProjectFormSummaryProps = {
  projectSummary: ReturnType<typeof getProjectSummary>;
  projectSoilsDistribution: ReconversionProjectSoilsDistribution;
  onNext: () => void;
  onBack: () => void;
  isDisabled: boolean;
  stepsGroupedBySections: ProjectStepGroups;
  onNavigateToStep: (stepId: UrbanProjectCreationStep) => void;
} & Partial<WizardFormLayoutProps>;

const WARNING_TEXT = "Cette étape est incomplète. Veuillez la compléter.";

function UrbanProjectFormSummary({
  projectSummary,
  projectSoilsDistribution,
  onNext,
  onBack,
  instructions = "Si des données sont erronées, vous pouvez revenir en arrière pour les modifier.",
  warnings,
  isDisabled,
  errors,
  stepsGroupedBySections,
  onNavigateToStep,
}: UrbanProjectFormSummaryProps) {
  const greenSpaces = projectSoilsDistribution.filter(
    ({ spaceCategory }) => spaceCategory === "PUBLIC_GREEN_SPACE",
  );
  const nonGreenSpaces = projectSoilsDistribution.filter(
    ({ spaceCategory }) => spaceCategory !== "PUBLIC_GREEN_SPACE",
  );
  const hasGreenSpaces = greenSpaces.length > 0;

  const getSectionProps = useCallback(
    (
      steps: {
        stepId: UrbanProjectCreationStep;
        isStepCompleted: boolean;
      }[],
    ) => {
      const firstUnfilledStep = steps.find(({ isStepCompleted }) => !isStepCompleted)?.stepId;
      const targetStep = firstUnfilledStep ?? steps[0]?.stepId;
      return {
        warning: firstUnfilledStep !== undefined ? WARNING_TEXT : undefined,
        buttonProps: targetStep
          ? {
              iconId: "fr-icon-pencil-line" as const,
              children: "Modifier",
              onClick: () => {
                onNavigateToStep(targetStep);
              },
            }
          : undefined,
      };
    },
    [onNavigateToStep],
  );

  const developerName = projectSummary.developer.value?.name;
  const reinstatementContractOwnerName = projectSummary.reinstatementContractOwner.value?.name;

  return (
    <WizardFormLayout
      title="Récapitulatif du projet"
      instructions={instructions}
      warnings={warnings}
      errors={errors}
    >
      <>
        {/* 🏗️ Type de projet */}
        <Section title="🏗️ Type de projet">
          <DataLine
            label={<strong>Type de projet</strong>}
            value={getLabelForDevelopmentPlanCategory("URBAN_PROJECT")}
          />
        </Section>

        {/* 🏙️ Usages */}
        <Section title="🏙️ Usages" {...getSectionProps(stepsGroupedBySections.USES)}>
          <DataLine
            label={<strong>Usages</strong>}
            value={
              projectSummary.selectedUses.value.length > 0
                ? projectSummary.selectedUses.value.map(getLabelForUrbanProjectUse).join(", ")
                : "Non renseigné"
            }
          />
          {projectSummary.publicGreenSpacesSurfaceArea.shouldDisplay && (
            <DataLine
              label={<strong>Superficie des espaces verts</strong>}
              value={
                projectSummary.publicGreenSpacesSurfaceArea.value
                  ? formatSurfaceArea(
                      roundToInteger(projectSummary.publicGreenSpacesSurfaceArea.value),
                    )
                  : "Non renseigné"
              }
            />
          )}
        </Section>

        {/* 🌾 Sols et espaces */}
        <Section title="🌾 Sols et espaces" {...getSectionProps(stepsGroupedBySections.SPACES)}>
          {hasGreenSpaces && (
            <>
              <DataLine
                noBorder
                label={<strong>Composition des espaces verts</strong>}
                value={
                  <strong>
                    {formatSurfaceArea(roundToInteger(sumListWithKey(greenSpaces, "surfaceArea")))}
                  </strong>
                }
              />
              {greenSpaces
                .filter(({ surfaceArea }) => surfaceArea)
                .map(({ soilType, surfaceArea }) => (
                  <DataLine
                    label={getLabelForSoilType(soilType)}
                    value={formatSurfaceArea(roundToInteger(surfaceArea))}
                    key={`green-${soilType}`}
                    isDetails
                  />
                ))}
            </>
          )}
          {nonGreenSpaces.length > 0 && (
            <>
              <DataLine
                noBorder
                label={
                  <strong>
                    {hasGreenSpaces ? "Composition des autres usages" : "Composition des usages"}
                  </strong>
                }
                value={
                  <strong>
                    {formatSurfaceArea(
                      roundToInteger(sumListWithKey(nonGreenSpaces, "surfaceArea")),
                    )}
                  </strong>
                }
              />
              {nonGreenSpaces
                .filter(({ surfaceArea }) => surfaceArea)
                .map(({ soilType, surfaceArea }) => (
                  <DataLine
                    label={getLabelForSpace(soilType)}
                    value={formatSurfaceArea(roundToInteger(surfaceArea))}
                    key={`space-${soilType}`}
                    isDetails
                  />
                ))}
            </>
          )}
        </Section>

        {/* 🏢 Bâtiments */}
        {projectSummary.buildingsFloorSurfaceArea.shouldDisplay && (
          <Section title="🏢 Bâtiments" {...getSectionProps(stepsGroupedBySections.BUILDINGS)}>
            <DataLine
              noBorder
              label={<strong>Surface de plancher des usages</strong>}
              value={
                projectSummary.buildingsFloorSurfaceArea.value
                  ? formatSurfaceArea(projectSummary.buildingsFloorSurfaceArea.value)
                  : "Non renseignée"
              }
            />
            {typedObjectEntries(projectSummary.buildingsUsesDistribution.value ?? {}).map(
              ([use, value]) =>
                value ? (
                  <DataLine
                    key={use}
                    label={getLabelForBuildingsUse(use)}
                    value={formatSurfaceArea(value)}
                    isDetails
                  />
                ) : undefined,
            )}
          </Section>
        )}

        {/* 🚧 Travaux */}
        {(projectSummary.reinstatementCosts.shouldDisplay ||
          projectSummary.decontaminationPlan.shouldDisplay) && (
          <Section
            title="🚧 Travaux"
            {...getSectionProps([...(stepsGroupedBySections.SOILS_DECONTAMINATION ?? [])])}
          >
            {projectSummary.reinstatementCosts.shouldDisplay && (
              <DataLine
                label={<strong>Travaux de remise en état</strong>}
                value={projectSummary.reinstatementCosts.value ? "Oui" : "Non"}
              />
            )}
            {projectSummary.decontaminationPlan.shouldDisplay && (
              <>
                <DataLine
                  label={<strong>Travaux de dépollution</strong>}
                  value={
                    projectSummary.decontaminationPlan.value &&
                    projectSummary.decontaminationPlan.value !== "none"
                      ? "Oui"
                      : "Non"
                  }
                />
                {projectSummary.decontaminatedSoilSurface.value && (
                  <DataLine
                    label="Surface à dépolluer"
                    value={formatSurfaceArea(
                      roundToInteger(projectSummary.decontaminatedSoilSurface.value),
                    )}
                    isDetails
                    valueTooltip={
                      projectSummary.decontaminatedSoilSurface.isAuto
                        ? `Bénéfriches considère que 75% de la surface polluée est dépolluée. Cette valeur est issue du retour d'expérience ADEME.`
                        : undefined
                    }
                  />
                )}
              </>
            )}
          </Section>
        )}

        {/* 🔑 Cession foncière */}
        <Section
          title="🔑 Cession foncière"
          {...getSectionProps(stepsGroupedBySections.SITE_RESALE)}
        >
          <DataLine
            label={<strong>Cession foncière</strong>}
            value={projectSummary.futureSiteOwner.value ? "Oui" : "Non"}
          />
          <DataLine
            label={<strong>Revente des bâtiments</strong>}
            value={
              projectSummary.futureOperator.shouldDisplay
                ? projectSummary.futureOperator.value
                  ? "Oui"
                  : "Non"
                : "Non"
            }
          />
        </Section>

        {/* 👥 Acteurs */}
        <Section
          title="👥 Acteurs"
          tooltip="Il s'agit des entités ou personnes impliquées dans la réalisation du projet."
          {...getSectionProps(stepsGroupedBySections.STAKEHOLDERS)}
        >
          <DataLine label={<strong>Aménageur</strong>} value={developerName ?? "Non renseigné"} />
          {projectSummary.reinstatementContractOwner.shouldDisplay && (
            <DataLine
              label={<strong>Maître d'ouvrage</strong>}
              value={reinstatementContractOwnerName ?? "Non renseigné"}
            />
          )}
        </Section>

        {/* 💸 Dépenses */}
        <UrbanProjectExpensesSection
          sitePurchaseTotalAmount={projectSummary.sitePurchaseTotalAmount}
          sitePurchasePropertyTransferDuties={projectSummary.sitePurchasePropertyTransferDuties}
          reinstatementCosts={projectSummary.reinstatementCosts}
          installationCosts={projectSummary.installationCosts}
          yearlyProjectedCosts={projectSummary.yearlyProjectedCosts}
          developerName={developerName}
          reinstatementContractOwnerName={reinstatementContractOwnerName}
          {...getSectionProps(stepsGroupedBySections.EXPENSES)}
        />

        {/* 💰 Recettes */}
        <UrbanProjectRevenuesSection
          siteResaleExpectedSellingPrice={projectSummary.siteResaleExpectedSellingPrice}
          buildingsResaleExpectedSellingPrice={projectSummary.buildingsResaleExpectedSellingPrice}
          yearlyProjectedRevenues={projectSummary.yearlyProjectedRevenues}
          financialAssistanceRevenues={projectSummary.financialAssistanceRevenues}
          buildingsFloorSurfaceArea={projectSummary.buildingsFloorSurfaceArea}
          developerName={developerName}
          {...getSectionProps(stepsGroupedBySections.REVENUE)}
        />

        {/* 📅 Calendrier */}
        <Section title="📅 Calendrier" {...getSectionProps(stepsGroupedBySections.SCHEDULE)}>
          {projectSummary.reinstatementSchedule.shouldDisplay && (
            <DataLine
              label={<strong>Travaux de remise en état</strong>}
              valueTooltip={
                projectSummary.reinstatementSchedule.isAuto
                  ? `Bénéfriches considère que les travaux de remise en état de la friche démarrent dans 1 an et durent 1 an.`
                  : undefined
              }
              value={
                projectSummary.reinstatementSchedule.value ? (
                  <ScheduleDates
                    startDateString={projectSummary.reinstatementSchedule.value.startDate}
                    endDateString={projectSummary.reinstatementSchedule.value.endDate}
                  />
                ) : (
                  "Non renseigné"
                )
              }
            />
          )}
          <DataLine
            label={<strong>Travaux d'aménagement</strong>}
            value={
              projectSummary.installationSchedule.value ? (
                <ScheduleDates
                  startDateString={projectSummary.installationSchedule.value.startDate}
                  endDateString={projectSummary.installationSchedule.value.endDate}
                />
              ) : (
                "Non renseigné"
              )
            }
            valueTooltip={
              projectSummary.installationSchedule.isAuto
                ? "Bénéfriches considère que les travaux d'aménagement  démarrent à l'issue des travaux de remise en état de la friche et durent 1 an."
                : undefined
            }
          />
          <DataLine
            label={<strong>Mise en service du site</strong>}
            value={projectSummary.operationsFirstYear.value ?? "Non renseigné"}
            valueTooltip={
              projectSummary.operationsFirstYear.isAuto
                ? "Bénéfriches considère que la mise en service du site intervient l'année suivant la fin de l'aménagement."
                : undefined
            }
          />
        </Section>

        {/* ✍️ Dénomination */}
        <Section title="✍️ Dénomination" {...getSectionProps(stepsGroupedBySections.NAMING)}>
          <DataLine
            label={<strong>Nom du projet</strong>}
            value={projectSummary.name.value ?? "Non renseigné"}
          />
          <DataLine
            label={<strong>Description</strong>}
            value={projectSummary.description.value ?? "Non renseigné"}
          />
        </Section>
      </>

      <div className="mt-8">
        <BackNextButtonsGroup
          onBack={onBack}
          onNext={onNext}
          nextLabel="Valider"
          disabled={isDisabled}
        />
      </div>
    </WizardFormLayout>
  );
}

export default UrbanProjectFormSummary;
