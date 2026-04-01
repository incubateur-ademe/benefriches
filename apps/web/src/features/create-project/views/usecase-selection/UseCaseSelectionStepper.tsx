import { useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import { selectUseCaseSelectionStepperViewData } from "../../core/usecase-selection/useCaseSelection.selectors";
import {
  USE_CASE_SELECTION_STEP_GROUP_IDS,
  USE_CASE_SELECTION_STEP_TO_GROUP,
} from "../../core/usecase-selection/useCaseSelectionStepperConfig";

function UseCaseSelectionStepper() {
  const { currentStep, stepCategories } = useAppSelector(selectUseCaseSelectionStepperViewData);

  const { groupId } = USE_CASE_SELECTION_STEP_TO_GROUP[currentStep];
  const currentStepIndex = USE_CASE_SELECTION_STEP_GROUP_IDS.indexOf(groupId);

  return (
    <FormStepperWrapper>
      {stepCategories.map((title, index) => (
        <li className="p-0" key={title}>
          <FormStepperStep
            key={title}
            title={title}
            variant={{
              activity: index === currentStepIndex ? "current" : "inactive",
              validation: currentStepIndex > index ? "completed" : "empty",
            }}
            as="button"
            className="text-left w-full"
          />
        </li>
      ))}
    </FormStepperWrapper>
  );
}

export default UseCaseSelectionStepper;
