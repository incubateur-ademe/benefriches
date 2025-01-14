import { SoilsDistribution, UrbanProjectSpace } from "shared";

import { UrbanProjectState } from "@/features/create-project/core/urban-project/urbanProject.reducer";
import ProjectFeaturesView from "@/features/projects/views/project-page/features/ProjectFeaturesView";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  projectId: string;
  projectData: UrbanProjectState["creationData"];
  projectSoilsDistribution: SoilsDistribution;
  projectSpaces: Partial<Record<UrbanProjectSpace, number>>;
  onNext: () => void;
  onBack: () => void;
};

function ProjectCreationDataSummary({
  projectId,
  projectData,
  projectSpaces,
  projectSoilsDistribution,
  onNext,
  onBack,
}: Props) {
  const sitePurchaseTotalAmount = projectData.sitePurchaseSellingPrice
    ? projectData.sitePurchaseSellingPrice + (projectData.sitePurchasePropertyTransferDuties ?? 0)
    : undefined;

  const siteResaleTotalAmount = projectData.siteResaleExpectedSellingPrice
    ? projectData.siteResaleExpectedSellingPrice +
      (projectData.siteResaleExpectedPropertyTransferDuties ?? 0)
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
          description: projectData.description,
          developmentPlan: {
            type: "URBAN_PROJECT",
            developerName: projectData.projectDeveloper?.name,
            installationCosts: projectData.installationExpenses ?? [],
            installationSchedule: projectData.installationSchedule,
            spaces: projectSpaces,
            buildingsFloorArea: projectData.buildingsUsesDistribution ?? {},
          },
          soilsDistribution: projectSoilsDistribution,
          reinstatementContractOwner: projectData.reinstatementContractOwner?.name,
          financialAssistanceRevenues: projectData.financialAssistanceRevenues,
          reinstatementCosts: projectData.reinstatementExpenses,
          yearlyProjectedExpenses: projectData.yearlyProjectedExpenses ?? [],
          yearlyProjectedRevenues: projectData.yearlyProjectedRevenues ?? [],
          reinstatementSchedule: projectData.reinstatementSchedule,
          firstYearOfOperation: projectData.firstYearOfOperation,
          sitePurchaseTotalAmount,
          siteResaleTotalAmount,
          decontaminatedSoilSurface: projectData.decontaminatedSurfaceArea,
        }}
      />

      <div className="tw-mt-8">
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} nextLabel="Valider" />
      </div>
    </WizardFormLayout>
  );
}

export default ProjectCreationDataSummary;
