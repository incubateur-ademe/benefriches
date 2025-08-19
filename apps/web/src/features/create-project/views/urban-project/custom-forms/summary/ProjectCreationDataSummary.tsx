import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { SoilsDistribution, LEGACY_UrbanProjectSpace } from "shared";

import { UrbanProjectCreationData } from "@/features/create-project/core/urban-project/creationData";
import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import ProjectFeaturesView from "@/features/projects/views/project-page/features/ProjectFeaturesView";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  projectId: string;
  projectData: UrbanProjectCreationData;
  projectSoilsDistribution: SoilsDistribution;
  projectSpaces: Partial<Record<LEGACY_UrbanProjectSpace, number>>;
  onNext: () => void;
  onBack: () => void;
  getSectionButtonProps: (stepId: UrbanProjectCustomCreationStep) => ButtonProps | undefined;
};

function ProjectCreationDataSummary({
  projectId,
  projectData,
  projectSpaces,
  projectSoilsDistribution,
  getSectionButtonProps,
  onNext,
  onBack,
}: Props) {
  const sitePurchaseTotalAmount = projectData.sitePurchaseSellingPrice
    ? projectData.sitePurchaseSellingPrice + (projectData.sitePurchasePropertyTransferDuties ?? 0)
    : undefined;

  return (
    <WizardFormLayout
      title="Récapitulatif du projet"
      instructions="Si des données sont erronées, vous pouvez revenir en arrière pour les modifier."
    >
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

      <div className="tw-mt-8">
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} nextLabel="Valider" />
      </div>
    </WizardFormLayout>
  );
}

export default ProjectCreationDataSummary;
