import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";

import { projectUseCaseSelectionStepGroupNavigated } from "../../core/usecase-selection/useCaseSelection.actions";
import { selectUseCaseSelectionStepperViewData } from "../../core/usecase-selection/useCaseSelection.selectors";
import {
  USE_CASE_SELECTION_STEP_GROUP_IDS,
  USE_CASE_SELECTION_STEP_TO_GROUP,
} from "../../core/usecase-selection/useCaseSelectionStepperConfig";

function UseCaseSelectionStepperSteps() {
  const { currentStep, stepCategories, currentProjectFlow } = useAppSelector(
    selectUseCaseSelectionStepperViewData,
  );
  const dispatch = useAppDispatch();

  const { groupId } = USE_CASE_SELECTION_STEP_TO_GROUP[currentStep];
  const currentStepIndex = USE_CASE_SELECTION_STEP_GROUP_IDS.indexOf(groupId);

  return stepCategories.map(({ title, targetStepId }, index) => (
    <li className="p-0" key={title}>
      <FormStepperStep
        key={title}
        selectable
        title={title}
        variant={{
          activity:
            currentProjectFlow === "USE_CASE_SELECTION" && index === currentStepIndex
              ? "current"
              : "inactive",
          validation:
            currentProjectFlow !== "USE_CASE_SELECTION" || currentStepIndex > index
              ? "completed"
              : "empty",
        }}
        as="button"
        className="text-left w-full"
        onClick={() => {
          dispatch(projectUseCaseSelectionStepGroupNavigated(targetStepId));
        }}
      />
    </li>
  ));
}

export default UseCaseSelectionStepperSteps;
