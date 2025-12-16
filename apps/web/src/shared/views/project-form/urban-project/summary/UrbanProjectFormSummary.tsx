import { useCallback } from "react";
import {
  ReconversionProjectSoilsDistribution,
  roundToInteger,
  sumListWithKey,
  typedObjectEntries,
} from "shared";

import { getLabelForDevelopmentPlanCategory } from "@/features/create-project/views/projectTypeLabelMapping";
import SoilsDistribution from "@/features/projects/views/project-page/features/SoilsDistribution";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getProjectSummary } from "@/shared/core/reducers/project-form/urban-project/helpers/projectSummary";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import {
  getLabelForBuildingsUse,
  getUrbanSpaceLabelForLivingAndActivitySpace,
  getUrbanSpaceLabelForPublicSpace,
} from "@/shared/core/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import ScheduleDates from "@/shared/views/components/FeaturesList/FeaturesListScheduleDates";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import InfoTooltip from "@/shared/views/components/InfoTooltip/InfoTooltip";
import WizardFormLayout, {
  WizardFormLayoutProps,
} from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { ProjectStepGroups } from "../../stepper/stepperConfig";
import ExpensesAndRevenuesSection from "./UrbanProjectExpensesAndRevenuesSummary";

export type UrbanProjectFormSummaryProps = {
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
  const livingAndActivitiesSpaces = projectSoilsDistribution.filter(
    ({ spaceCategory }) => spaceCategory === "LIVING_AND_ACTIVITY_SPACE",
  );

  const totalGrassPublicSpaces =
    projectSoilsDistribution.find(
      ({ spaceCategory, soilType }) =>
        spaceCategory === "PUBLIC_SPACE" && soilType === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    )?.surfaceArea ?? 0;

  const otherPublicSpaces = projectSoilsDistribution.filter(
    ({ spaceCategory, soilType }) =>
      spaceCategory === "PUBLIC_SPACE" && soilType !== "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  );

  const totalPublicGreenSpaces = sumListWithKey(
    projectSoilsDistribution.filter(({ spaceCategory }) => spaceCategory === "PUBLIC_GREEN_SPACE"),
    "surfaceArea",
  );

  const totalLivingAndActivitiesSpaces = sumListWithKey(livingAndActivitiesSpaces, "surfaceArea");
  const totalPublicGreenSpacesAndPublicGrassSpaces =
    totalGrassPublicSpaces + totalPublicGreenSpaces;

  const totalOtherPublicSpaces = sumListWithKey(otherPublicSpaces, "surfaceArea");

  const totalSurfaceArea = sumListWithKey(projectSoilsDistribution, "surfaceArea");

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

  return (
    <WizardFormLayout
      title="Récapitulatif du projet"
      instructions={instructions}
      warnings={warnings}
      errors={errors}
    >
      <>
        <Section title="🏗️ Type de projet">
          <DataLine
            label={<strong>Type d'aménagement</strong>}
            value={getLabelForDevelopmentPlanCategory("URBAN_PROJECT")}
          />
        </Section>

        <Section title="🏘️ Espaces" {...getSectionProps(stepsGroupedBySections.SPACES)}>
          <DataLine
            label={<strong>Superficie du site</strong>}
            value={<strong>{formatSurfaceArea(roundToInteger(totalSurfaceArea))}</strong>}
          />
          {totalLivingAndActivitiesSpaces > 0 && (
            <DataLine
              label="Lieux d'habitation et d’activité"
              labelTooltip="Les lieux d'habitation et d’activité regroupent les lots dédiés aux logements, aux activités économiques, les emprises des équipements publics, en dehors des espaces verts publics et autres espaces publics de type rues, places, parking…"
              value={formatSurfaceArea(roundToInteger(totalLivingAndActivitiesSpaces))}
            />
          )}
          {totalOtherPublicSpaces > 0 && (
            <DataLine
              label="Espaces publics"
              value={formatSurfaceArea(roundToInteger(totalOtherPublicSpaces))}
            />
          )}
          {totalPublicGreenSpacesAndPublicGrassSpaces > 0 && (
            <DataLine
              label="Espaces verts publics"
              labelTooltip="Il s’agit des espaces verts publics (parcs, jardins, forêt urbaines, alignements d’arbres, noues, etc.)."
              value={formatSurfaceArea(roundToInteger(totalPublicGreenSpacesAndPublicGrassSpaces))}
            />
          )}
        </Section>

        {projectSummary.decontaminatedSoilSurface.shouldDisplay && (
          <Section
            {...getSectionProps(stepsGroupedBySections.SOILS_DECONTAMINATION)}
            title="✨ Dépollution"
            tooltip="Les sols de la friche nécessitent une dépollution pour permettre la réalisation du projet. La pollution à l’amiante des bâtiments n’est pas considérée ici."
          >
            <DataLine
              label="Surface dépolluée"
              value={
                projectSummary.decontaminatedSoilSurface.value
                  ? formatSurfaceArea(
                      roundToInteger(projectSummary.decontaminatedSoilSurface.value),
                    )
                  : "Non renseigné"
              }
              valueTooltip={
                projectSummary.decontaminatedSoilSurface.isAuto
                  ? `Bénéfriches considère que 75% de la surface polluée est dépolluée. Cette valeur est issue du retour d’expérience ADEME.`
                  : undefined
              }
            />
          </Section>
        )}

        <Section
          title="🌾 Aménagement des espaces"
          {...getSectionProps(stepsGroupedBySections.SPACES_DEVELOPMENT)}
        >
          {totalLivingAndActivitiesSpaces > 0 && (
            <>
              <DataLine
                noBorder
                label={<strong>Lieux d’habitation et d’activité</strong>}
                value={
                  <strong>
                    {formatSurfaceArea(roundToInteger(totalLivingAndActivitiesSpaces))}
                  </strong>
                }
              />
              {livingAndActivitiesSpaces
                .filter(({ surfaceArea }) => surfaceArea)
                .map(({ spaceCategory, soilType, surfaceArea }) => {
                  return (
                    <DataLine
                      label={getUrbanSpaceLabelForLivingAndActivitySpace(soilType)}
                      value={formatSurfaceArea(roundToInteger(surfaceArea))}
                      key={`${spaceCategory}-${soilType}`}
                      isDetails
                    />
                  );
                })}
            </>
          )}
          {totalPublicGreenSpacesAndPublicGrassSpaces > 0 && (
            <>
              <DataLine
                noBorder
                label={<strong>Espaces verts publics</strong>}
                value={
                  <strong>
                    {formatSurfaceArea(roundToInteger(totalPublicGreenSpacesAndPublicGrassSpaces))}
                  </strong>
                }
              />
              {totalGrassPublicSpaces > 0 && (
                <DataLine
                  label="Voies, places, trottoirs enherbés"
                  value={formatSurfaceArea(roundToInteger(totalGrassPublicSpaces))}
                  isDetails
                />
              )}
              {totalPublicGreenSpaces > 0 && (
                <DataLine
                  label="Espaces verts publics"
                  value={formatSurfaceArea(roundToInteger(totalPublicGreenSpaces))}
                  isDetails
                />
              )}
            </>
          )}
          {totalOtherPublicSpaces > 0 && (
            <>
              <DataLine
                noBorder
                label={<strong>Espaces publics</strong>}
                labelTooltip="Les espaces publics sont comptabilisés hors espaces verts."
                value={<strong>{formatSurfaceArea(roundToInteger(totalOtherPublicSpaces))}</strong>}
              />
              {otherPublicSpaces
                .filter(({ surfaceArea }) => surfaceArea)
                .map(({ spaceCategory, soilType, surfaceArea }) => {
                  return (
                    <DataLine
                      label={getUrbanSpaceLabelForPublicSpace(soilType)}
                      value={formatSurfaceArea(roundToInteger(surfaceArea))}
                      key={`${spaceCategory}-${soilType}`}
                      isDetails
                    />
                  );
                })}
            </>
          )}

          <SoilsDistribution
            isExpressProject={false}
            projectType="URBAN_PROJECT"
            soilsDistribution={projectSoilsDistribution}
          />
        </Section>

        {projectSummary.buildingsFloorSurfaceArea.shouldDisplay && (
          <Section
            {...getSectionProps(
              stepsGroupedBySections.BUILDINGS.concat(stepsGroupedBySections.BUILDINGS_USE),
            )}
            title="🏢 Bâtiments"
          >
            <DataLine
              noBorder
              label={<strong>Surface de plancher des bâtiments</strong>}
              value={
                projectSummary.buildingsFloorSurfaceArea.value
                  ? formatSurfaceArea(projectSummary.buildingsFloorSurfaceArea.value)
                  : "Non renseignée"
              }
            />
            <h4 className="text-base pb-2 pt-4 mb-0">
              Usage des bâtiments{" "}
              <InfoTooltip title="L’usage des bâtiments correspond à leur destination (logements, services de proximité, bureaux, équipements publics, etc.)" />
            </h4>
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

        <Section
          title="👱 Acteurs"
          tooltip="Il s’agit des entités ou personnes impliquées dans la réalisation du projet."
          {...getSectionProps(stepsGroupedBySections.STAKEHOLDERS)}
        >
          <DataLine
            label={<strong>Aménageur du site</strong>}
            value={projectSummary.developer.value?.name ?? "Non renseigné"}
          />

          <DataLine
            label={<strong>Maître d'ouvrage des travaux de remise en état de la friche</strong>}
            value={projectSummary.reinstatementContractOwner.value?.name ?? "Non renseigné"}
          />
        </Section>

        <Section
          title="🏠 Cession foncière"
          {...getSectionProps(stepsGroupedBySections.SITE_RESALE)}
        >
          <DataLine
            label={<strong>Cession du site</strong>}
            value={projectSummary.futureSiteOwner.value ? "Oui" : "Non"}
          />

          <DataLine
            label={<strong>Cession des bâtiments</strong>}
            value={projectSummary.futureOperator.value ? "Oui" : "Non"}
          />

          {projectSummary.futureOperator.value && (
            <DataLine
              label={<strong>Futur exploitant</strong>}
              value={projectSummary.futureOperator.value?.name}
              valueTooltip={
                projectSummary.futureOperator.isAuto
                  ? "Bénéfriches considère par défaut que le futur exploitant est l'aménageur du projet"
                  : undefined
              }
            />
          )}
        </Section>

        <ExpensesAndRevenuesSection
          installationCosts={projectSummary.installationCosts}
          yearlyProjectedCosts={projectSummary.yearlyProjectedCosts}
          yearlyProjectedRevenues={projectSummary.yearlyProjectedRevenues}
          sitePurchaseTotalAmount={projectSummary.sitePurchaseTotalAmount}
          siteResaleExpectedSellingPrice={projectSummary.siteResaleExpectedSellingPrice}
          buildingsResaleExpectedSellingPrice={projectSummary.buildingsResaleExpectedSellingPrice}
          financialAssistanceRevenues={projectSummary.financialAssistanceRevenues}
          reinstatementCosts={projectSummary.reinstatementCosts}
          buildingsFloorSurfaceArea={projectSummary.buildingsFloorSurfaceArea}
          {...getSectionProps(
            stepsGroupedBySections.EXPENSES.concat(stepsGroupedBySections.REVENUE),
          )}
        />

        <Section title="📆 Calendrier" {...getSectionProps(stepsGroupedBySections.SCHEDULE)}>
          {projectSummary.reinstatementSchedule.shouldDisplay && (
            <DataLine
              label={<strong>Travaux de remise en état de la friche</strong>}
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
            label={<strong>Aménagement du site</strong>}
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
                ? "Bénéfriches considère que les travaux d'aménagement  démarrent à l’issue des travaux de remise en état de la friche et durent 1 an."
                : undefined
            }
          />

          <DataLine
            label={<strong>Mise en service du site</strong>}
            value={projectSummary.operationsFirstYear.value ?? "Non renseigné"}
            valueTooltip={
              projectSummary.operationsFirstYear.isAuto
                ? "Bénéfriches considère que la mise en service du site intervient l’année suivant la fin de l’aménagement."
                : undefined
            }
          />
        </Section>
        <Section title="✍️ Dénomination" {...getSectionProps(stepsGroupedBySections.NAMING)}>
          <DataLine label={<strong>Nom du projet</strong>} value={projectSummary.name.value} />
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
