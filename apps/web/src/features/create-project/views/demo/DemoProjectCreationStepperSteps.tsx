import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";

import { demoStepGroupNavigated } from "../../core/demo/demoProject.actions";
import { selectDemoProjectStepperViewData } from "../../core/demo/demoProject.selectors";
import { DEMO_STEP_GROUP_IDS, DEMO_STEP_TO_GROUP } from "../../core/demo/demoStepperConfig";

function DemoProjectCreationStepperSteps() {
  const { currentStep, stepCategories, currentProjectFlow } = useAppSelector(
    selectDemoProjectStepperViewData,
  );

  const { groupId } = DEMO_STEP_TO_GROUP[currentStep];
  const currentStepIndex = DEMO_STEP_GROUP_IDS.indexOf(groupId);

  const dispatch = useAppDispatch();

  return stepCategories.map(({ title, targetStepId }, index) => (
    <li className="p-0" key={title}>
      <FormStepperStep
        key={title}
        title={title}
        variant={{
          activity:
            currentProjectFlow === "DEMO" && index === currentStepIndex ? "current" : "inactive",
          validation: currentStepIndex > index ? "completed" : "empty",
        }}
        selectable
        onClick={() => {
          dispatch(demoStepGroupNavigated(targetStepId));
        }}
        as="button"
        className="text-left w-full"
      />
    </li>
  ));
}

export default DemoProjectCreationStepperSteps;
