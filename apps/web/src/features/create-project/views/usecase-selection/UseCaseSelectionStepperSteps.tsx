import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";

import { projectUseCaseSelectionStepGroupNavigated } from "../../core/usecase-selection/useCaseSelection.actions";
import { selectUseCaseSelectionStepperViewData } from "../../core/usecase-selection/useCaseSelection.selectors";

function UseCaseSelectionStepperSteps() {
  const { stepCategories } = useAppSelector(selectUseCaseSelectionStepperViewData);
  const dispatch = useAppDispatch();

  return stepCategories.map(({ title, targetStepId, variant }) => (
    <li className="p-0" key={title}>
      <FormStepperStep
        key={title}
        selectable
        title={title}
        variant={variant}
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
