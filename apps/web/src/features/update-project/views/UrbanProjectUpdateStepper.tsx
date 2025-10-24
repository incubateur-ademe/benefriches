import { useContext } from "react";

import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { RootState } from "@/shared/core/store-config/store";
import classNames from "@/shared/views/clsx";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { SidebarLayoutContext } from "@/shared/views/layout/SidebarLayout/SidebarLayoutContext";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";
import StepperLiItem from "@/shared/views/project-form/stepper/StepperItem";
import { STEP_LABELS } from "@/shared/views/project-form/stepper/stepperConfig";
import { useMapStepListToCategoryList } from "@/shared/views/project-form/stepper/useMapStepListToCategoryList";
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
  const { selectAvailableStepsState, onNavigateToStep } = useProjectForm();
  const availableStepsState = useAppSelector(selectAvailableStepsState);
  const saveState = useAppSelector(
    (state: RootState) => state.projectCreation.urbanProject.saveState,
  );

  const { categories, nextAvailableCategory } = useMapStepListToCategoryList(
    availableStepsState,
    currentStep,
  );

  const isFormDisabled = saveState === "success";

  const summary = categories.find(({ labelKey }) => labelKey === "SUMMARY");

  return (
    <>
      {summary && (
        <SummaryButton
          onClick={() => {
            onNavigateToStep(summary.targetStepId);
          }}
          isSelected={summary.state === "current"}
        />
      )}

      <FormStepperWrapper className="my-0">
        {categories
          .filter(({ labelKey }) => labelKey !== "SUMMARY")
          .map(({ targetStepId, labelKey, subCategories, state }) => (
            <StepperLiItem
              key={labelKey}
              title={STEP_LABELS[labelKey]}
              state={state}
              isFormDisabled={isFormDisabled}
              isNextAvailable={nextAvailableCategory?.category === labelKey}
              onClick={() => {
                onNavigateToStep(targetStepId);
              }}
            >
              {subCategories && (state === "active" || state === "current") && (
                <FormStepperWrapper className="my-0">
                  {subCategories.map((subStep) => (
                    <StepperLiItem
                      key={subStep.labelKey}
                      title={STEP_LABELS[subStep.labelKey]}
                      state={subStep.state}
                      className="pl-6"
                      isFormDisabled={isFormDisabled}
                      isNextAvailable={nextAvailableCategory?.subCategory === subStep.labelKey}
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
