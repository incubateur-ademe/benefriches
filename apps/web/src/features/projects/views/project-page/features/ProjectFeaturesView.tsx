import { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "@/features/create-project/views/projectTypeLabelMapping";
import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import ScheduleDates from "@/shared/views/components/FeaturesList/FeaturesListScheduleDates";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import DevelopmentPlanFeatures from "./DevelopmentPlanFeatures";
import ExpensesAndRevenuesSection from "./ExpensesAndRevenues";

type Props = {
  projectData: ProjectFeatures;
  getSectionButtonProps?: (stepId: UrbanProjectCreationStep) => ButtonProps | undefined;
};

export default function ProjectFeaturesView({ projectData, getSectionButtonProps }: Props) {
  return (
    <>
      <Section title="🏗 Type de projet">
        <DataLine
          label={<strong>Type d'aménagement</strong>}
          value={
            projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
              ? getLabelForDevelopmentPlanCategory("RENEWABLE_ENERGY")
              : getLabelForDevelopmentPlanCategory(projectData.developmentPlan.type)
          }
        />
        {projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" && (
          <DataLine
            label={<strong>Type d'énergies renouvelables</strong>}
            value={getLabelForRenewableEnergyProductionType("PHOTOVOLTAIC_POWER_PLANT")}
          />
        )}
      </Section>
      <DevelopmentPlanFeatures {...projectData} getSectionButtonProps={getSectionButtonProps} />

      <Section
        title="👱 Acteurs"
        tooltip="Il s’agit des entités ou personnes impliquées dans la réalisation du projet."
        buttonProps={
          getSectionButtonProps
            ? getSectionButtonProps("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
            : undefined
        }
      >
        <DataLine
          label={<strong>Aménageur du site</strong>}
          value={projectData.developmentPlan.developerName ?? "Non renseigné"}
          valueTooltip={
            projectData.isExpress
              ? "On considère que l’aménageur est la collectivité, actuel propriétaire du site."
              : undefined
          }
        />
        <DataLine
          label={<strong>Futur propriétaire du site</strong>}
          labelTooltip="Le futur propriétaire est l’acteur à qui l’aménageur cèdera le terrain pour la réalisation du projet."
          value={projectData.futureOwner ?? "Pas de changement de propriétaire"}
        />
        {projectData.futureOperator && (
          <DataLine label={<strong>Futur exploitant</strong>} value={projectData.futureOperator} />
        )}
        {projectData.reinstatementContractOwner && (
          <DataLine
            label={<strong>Maître d'ouvrage des travaux de remise en état de la friche</strong>}
            value={projectData.reinstatementContractOwner}
            valueTooltip={
              projectData.isExpress
                ? "Bénéfriches considère que le maître d'ouvrage des travaux de remise en état de la friche est l’aménageur."
                : undefined
            }
          />
        )}
      </Section>
      <ExpensesAndRevenuesSection
        developmentPlanType={projectData.developmentPlan.type}
        installationCosts={projectData.developmentPlan.installationCosts}
        yearlyProjectedExpenses={projectData.yearlyProjectedExpenses}
        yearlyProjectedRevenues={projectData.yearlyProjectedRevenues}
        sitePurchaseTotalAmount={projectData.sitePurchaseTotalAmount}
        siteResaleSellingPrice={projectData.siteResaleSellingPrice}
        buildingsResaleSellingPrice={projectData.buildingsResaleSellingPrice}
        financialAssistanceRevenues={projectData.financialAssistanceRevenues}
        reinstatementCosts={projectData.reinstatementCosts}
        buttonProps={
          getSectionButtonProps
            ? getSectionButtonProps("URBAN_PROJECT_EXPENSES_INTRODUCTION")
            : undefined
        }
        isExpress={projectData.isExpress}
        buildingsFloorArea={
          projectData.developmentPlan.type === "URBAN_PROJECT"
            ? projectData.developmentPlan.buildingsFloorArea
            : undefined
        }
      />
      <Section
        title="📆 Calendrier"
        buttonProps={
          getSectionButtonProps
            ? getSectionButtonProps("URBAN_PROJECT_SCHEDULE_INTRODUCTION")
            : undefined
        }
      >
        {projectData.reinstatementSchedule && (
          <DataLine
            label={<strong>Travaux de remise en état de la friche</strong>}
            valueTooltip={
              projectData.isExpress
                ? `Bénéfriches considère que les travaux de remise en état de la friche démarrent dans 1 an et durent 1 an.`
                : undefined
            }
            value={
              <ScheduleDates
                startDateString={projectData.reinstatementSchedule.startDate}
                endDateString={projectData.reinstatementSchedule.endDate}
              />
            }
          />
        )}
        {projectData.developmentPlan.installationSchedule && (
          <DataLine
            label={<strong>Aménagement du site</strong>}
            value={
              <ScheduleDates
                startDateString={projectData.developmentPlan.installationSchedule.startDate}
                endDateString={projectData.developmentPlan.installationSchedule.endDate}
              />
            }
            valueTooltip={
              projectData.isExpress
                ? "Bénéfriches considère que les travaux d'aménagement  démarrent à l’issue des travaux de remise en état de la friche et durent 1 an."
                : undefined
            }
          />
        )}
        <DataLine
          label={<strong>Mise en service du site</strong>}
          value={projectData.firstYearOfOperation ?? "Non renseigné"}
          valueTooltip={
            projectData.isExpress
              ? "Bénéfriches considère que la mise en service du site intervient l’année suivant la fin de l’aménagement."
              : undefined
          }
        />
      </Section>
      <Section
        title="✍️ Dénomination"
        buttonProps={
          getSectionButtonProps ? getSectionButtonProps("URBAN_PROJECT_NAMING") : undefined
        }
      >
        <DataLine label={<strong>Nom du projet</strong>} value={projectData.name} />
        {projectData.description && (
          <DataLine label={<strong>Description</strong>} value={projectData.description} />
        )}
      </Section>
    </>
  );
}
