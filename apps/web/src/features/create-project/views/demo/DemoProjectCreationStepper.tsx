import { useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import { selectDemoProjectStepperViewData } from "../../core/demo/demoProject.selectors";
import {
  DEMO_STEP_GROUP_IDS,
  DEMO_STEP_GROUP_LABELS,
  DEMO_STEP_TO_GROUP,
} from "../../core/demo/demoStepperConfig";
import { selectUseCaseSelectionStepperViewData } from "../../core/usecase-selection/useCaseSelection.selectors";

function DemoProjectCreationStepper() {
  const { currentStep } = useAppSelector(selectDemoProjectStepperViewData);
  const { stepCategories: useCaseSelectionSteps } = useAppSelector(
    selectUseCaseSelectionStepperViewData,
  );

  const { groupId } = DEMO_STEP_TO_GROUP[currentStep];
  const currentStepIndex = DEMO_STEP_GROUP_IDS.indexOf(groupId);

  const stepCategories = DEMO_STEP_GROUP_IDS.map((id) => DEMO_STEP_GROUP_LABELS[id]);

  return (
    <FormStepperWrapper>
      {useCaseSelectionSteps.map((title) => (
        <li className="p-0" key={title}>
          <FormStepperStep
            key={title}
            title={title}
            variant={{ activity: "inactive", validation: "completed" }}
            as="button"
            className="text-left w-full"
          />
        </li>
      ))}
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

export default DemoProjectCreationStepper;
