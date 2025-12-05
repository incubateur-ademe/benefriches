import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { ReconversionProjectSoilsDistribution } from "shared";

import ProjectFeaturesView from "@/features/projects/views/project-page/features/ProjectFeaturesView";
import { CustomFormAnswers } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout, {
  WizardFormLayoutProps,
} from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { StepGroupId } from "../../stepper/stepperConfig";

type Props = {
  projectData: CustomFormAnswers;
  projectSoilsDistribution: ReconversionProjectSoilsDistribution;
  onNext: () => void;
  onBack: () => void;
  getSectionButtonProps: (stepGroupId: StepGroupId) => ButtonProps | undefined;
  nextDisabled?: boolean;
} & Partial<WizardFormLayoutProps>;

function ProjectCreationDataSummary({
  projectData,
  projectSoilsDistribution,
  getSectionButtonProps,
  onNext,
  onBack,
  nextDisabled,
  title = "Récapitulatif du projet",
  instructions = "Si des données sont erronées, vous pouvez revenir en arrière pour les modifier.",
  warnings,
}: Props) {
  const sitePurchaseTotalAmount = projectData.sitePurchaseSellingPrice
    ? projectData.sitePurchaseSellingPrice + (projectData.sitePurchasePropertyTransferDuties ?? 0)
    : undefined;

  return (
    <WizardFormLayout title={title} instructions={instructions} warnings={warnings}>
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
