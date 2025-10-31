import { useContext } from "react";

import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { RootState } from "@/shared/core/store-config/store";
import classNames from "@/shared/views/clsx";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { SidebarLayoutContext } from "@/shared/views/layout/SidebarLayout/SidebarLayoutContext";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";
import StepperLiItem from "@/shared/views/project-form/stepper/StepperItem";
import { STEP_TO_GROUP_MAPPING } from "@/shared/views/project-form/stepper/stepperConfig";
import { useBuildStepperNavigationItems } from "@/shared/views/project-form/stepper/useBuildStepperNavigationItems";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

type Props = {
  step: UrbanProjectCreationStep;
};

type SummaryButtonProps = {
  isSelected: boolean;
  onClick: () => void;
};

const SummaryButton = ({ onClick, isSelected }: SummaryButtonProps) => {
  const { isOpen: isExtended } = useContext(SidebarLayoutContext);

  return (
    <button
      title={!isExtended ? "Récapitulatif du projet" : undefined}
      onClick={onClick}
      className={classNames(
        "flex",
        "items-center",
        "p-2",
        "before:mx-4",
        "marker:content-none",
        "ri-file-list-line ",
        isSelected
          ? [
              "bg-blue-ultralight dark:bg-blue-ultradark",
              "text-blue-ultradark dark:text-blue-ultralight",
            ]
          : "text-dsfr-greyDisabled font-medium",
        "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",
        "text-left font-bold w-full py-3",
      )}
    >
      {isExtended && "Récapitulatif du projet"}
    </button>
  );
};

function UrbanProjectUpdateStepper({ step: currentStep }: Props) {
  const {
    selectStepsGroupedBySections,
    selectNextEmptyStep,
    onNavigateToStep,
    onNavigateToStepperGroup,
  } = useProjectForm();

  const stepsGroupedBySections = useAppSelector(selectStepsGroupedBySections);
  const nextEmptyStep = useAppSelector(selectNextEmptyStep);

  const saveState = useAppSelector(
    (state: RootState) => state.projectCreation.urbanProject.saveState,
  );

  const stepGroupsList = useBuildStepperNavigationItems(stepsGroupedBySections, currentStep);

  const { groupId: nextEmptyStepGroupId, subGroupId: nextEmptyStepSubGroupId } = nextEmptyStep
    ? STEP_TO_GROUP_MAPPING[nextEmptyStep]
    : {};

  const isFormDisabled = saveState === "success";

  const summary = stepGroupsList.find(({ groupId }) => groupId === "SUMMARY");

  return (
    <>
      {summary && (
        <SummaryButton
          onClick={() => {
            onNavigateToStepperGroup("SUMMARY");
          }}
          isSelected={summary.variant === "current" || summary.variant === "active"}
        />
      )}

      <FormStepperWrapper className="my-0">
        {stepGroupsList
          .filter(({ groupId }) => groupId !== "SUMMARY")
          .map(({ title, groupId, subGroups, variant }) => (
            <StepperLiItem
              key={title}
              title={title}
              variant={variant}
              isFormDisabled={isFormDisabled}
              isNextAvailable={nextEmptyStepGroupId === groupId}
              onClick={() => {
                onNavigateToStepperGroup(groupId);
              }}
            >
              {subGroups && (variant === "active" || variant === "current") && (
                <FormStepperWrapper className="my-0">
                  {subGroups.map((subStep) => (
                    <StepperLiItem
                      key={subStep.title}
                      title={subStep.title}
                      variant={subStep.variant}
                      className="pl-6"
                      isFormDisabled={isFormDisabled}
                      isNextAvailable={nextEmptyStepSubGroupId === subStep.subGroupId}
                      onClick={() => {
                        onNavigateToStep(subStep.targetStepId);
                      }}
                    />
                  ))}
                </FormStepperWrapper>
              )}
            </StepperLiItem>
          ))}
      </FormStepperWrapper>
    </>
  );
}

export default UrbanProjectUpdateStepper;
