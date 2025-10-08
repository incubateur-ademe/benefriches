import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";
import { SoilsDistribution, LEGACY_UrbanProjectSpace } from "shared";

import {
  CustomFormAnswers,
  UrbanProjectCreationStep,
} from "@/features/create-project/core/urban-project/urbanProjectSteps";
import ProjectFeaturesView from "@/features/projects/views/project-page/features/ProjectFeaturesView";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  projectId: string;
  projectData: CustomFormAnswers;
  projectSoilsDistribution: SoilsDistribution;
  projectSpaces: Partial<Record<LEGACY_UrbanProjectSpace, number>>;
  onNext: () => void;
  onBack: () => void;
  getSectionButtonProps: (stepId: UrbanProjectCreationStep) => ButtonProps | undefined;
  nextDisabled?: boolean;
  instructions?: ReactNode;
};

function ProjectCreationDataSummary({
  projectId,
  projectData,
  projectSpaces,
  projectSoilsDistribution,
  getSectionButtonProps,
  onNext,
  onBack,
  nextDisabled,
  instructions = "Si des données sont erronées, vous pouvez revenir en arrière pour les modifier.",
}: Props) {
  const sitePurchaseTotalAmount = projectData.sitePurchaseSellingPrice
    ? projectData.sitePurchaseSellingPrice + (projectData.sitePurchasePropertyTransferDuties ?? 0)
    : undefined;

  return (
    <WizardFormLayout title="Récapitulatif du projet" instructions={instructions}>
      <ProjectFeaturesView
        projectData={{
          id: projectId,
          name: projectData.name ?? "",
          isExpress: false,
          description: projectData.description,
          developmentPlan: {
            type: "URBAN_PROJECT",
            developerName: projectData.projectDeveloper?.name,
            installationCosts: projectData.installationExpenses ?? [],
            installationSchedule: projectData.installationSchedule,
            spaces: projectSpaces,
            buildingsFloorArea: projectData.buildingsUsesDistribution ?? {},
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
