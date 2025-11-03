import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";
import { SoilsDistribution, LEGACY_UrbanProjectSpace } from "shared";

import ProjectFeaturesView from "@/features/projects/views/project-page/features/ProjectFeaturesView";
import { CustomFormAnswers } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { StepGroupId } from "../../stepper/stepperConfig";

type Props = {
  projectData: CustomFormAnswers;
  projectSoilsDistribution: SoilsDistribution;
  projectSpaces: Partial<Record<LEGACY_UrbanProjectSpace, number>>;
  onNext: () => void;
  onBack: () => void;
  getSectionButtonProps: (stepGroupId: StepGroupId) => ButtonProps | undefined;
  nextDisabled?: boolean;
  instructions?: ReactNode;
  title?: ReactNode;
};

function ProjectCreationDataSummary({
  projectData,
  projectSpaces,
  projectSoilsDistribution,
  getSectionButtonProps,
  onNext,
  onBack,
  nextDisabled,
  title = "Récapitulatif du projet",
  instructions = "Si des données sont erronées, vous pouvez revenir en arrière pour les modifier.",
}: Props) {
  const sitePurchaseTotalAmount = projectData.sitePurchaseSellingPrice
    ? projectData.sitePurchaseSellingPrice + (projectData.sitePurchasePropertyTransferDuties ?? 0)
    : undefined;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <ProjectFeaturesView
        projectData={{
          name: projectData.name ?? "",
          isExpress: false,
          description: projectData.description,
          developmentPlan: {
            type: "URBAN_PROJECT",
            developerName: projectData.projectDeveloper?.name,
            installationCosts: projectData.installationExpenses ?? [],
            installationSchedule: projectData.installationSchedule,
            spacesDistribution: projectSpaces,
            buildingsFloorAreaDistribution: projectData.buildingsUsesDistribution ?? {},
          },
          futureOwner: projectData.futureSiteOwner?.name,
          futureOperator: projectData.futureOperator?.name,
          soilsDistribution: projectSoilsDistribution,
          reinstatementContractOwner: projectData.reinstatementContractOwner?.name,
          financialAssistanceRevenues: projectData.financialAssistanceRevenues,
          reinstatementCosts: projectData.reinstatementExpenses,
          yearlyProjectedExpenses: projectData.yearlyProjectedBuildingsOperationsExpenses ?? [],
          yearlyProjectedRevenues: projectData.yearlyProjectedRevenues ?? [],
          reinstatementSchedule: projectData.reinstatementSchedule,
          firstYearOfOperation: projectData.firstYearOfOperation,
          sitePurchaseTotalAmount,
          siteResaleSellingPrice: projectData.siteResaleExpectedSellingPrice,
          buildingsResaleSellingPrice: projectData.buildingsResaleSellingPrice,
          decontaminatedSoilSurface: projectData.decontaminatedSurfaceArea,
        }}
        getSectionButtonProps={getSectionButtonProps}
      />

      <div className="mt-8">
        <BackNextButtonsGroup
          onBack={onBack}
          onNext={onNext}
          nextLabel="Valider"
          disabled={nextDisabled}
        />
      </div>
    </WizardFormLayout>
  );
}

export default ProjectCreationDataSummary;
