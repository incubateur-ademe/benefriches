import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  RENEWABLE_ENERGY_STEP_GROUP_LABELS,
  RENEWABLE_ENERGY_STEP_TO_GROUP,
} from "@/features/create-project/core/renewable-energy/step-handlers/renewableEnergyStepperConfig";
import { useBuildStepperNavigationItems } from "@/shared/core/wizard-form/helpers/useBuildStepperNavigationItems";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import { updateProjectFormRenewableEnergyActions } from "../../core/updateProject.actions";
import {
  selectCurrentStep,
  selectPhotovoltaicPowerPlantUpdateStepperDataView,
  selectPhotovoltaicStepsGroupedBySections,
} from "../../core/updateProject.selectors";
import UpdateFormStepperStep from "../UpdateFormStepperStep";

function PhotovoltaicPowerPlantUpdateStepperSteps() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const { stepGroups } = useAppSelector(selectPhotovoltaicPowerPlantUpdateStepperDataView);
  const stepsGroupedBySections = useAppSelector(selectPhotovoltaicStepsGroupedBySections);

  const stepGroupsList = useBuildStepperNavigationItems({
    stepGroups: stepsGroupedBySections,
    currentStep,
    stepToGroupMapping: RENEWABLE_ENERGY_STEP_TO_GROUP,
    labels: RENEWABLE_ENERGY_STEP_GROUP_LABELS,
  });

  return (
    <FormStepperWrapper className="my-0">
      {stepGroupsList.map(({ groupId, title, variant, subGroups }) => {
        // Group-level targeting ("first incomplete, else first") is unchanged: it still comes
        // from `computeRenewableEnergyStepperGroups`, via `stepGroups`.
        const targetStepId = stepGroups.find((group) => group.groupId === groupId)?.targetStepId;

        return (
          <li className="p-0" key={groupId}>
            <UpdateFormStepperStep
              title={title}
              variant={variant}
              onClick={() => {
                if (targetStepId) {
                  dispatch(
                    updateProjectFormRenewableEnergyActions.stepNavigationRequested({
                      stepId: targetStepId,
                    }),
                  );
                }
              }}
            />
            {subGroups.length > 0 &&
              (variant.activity === "groupActive" || variant.activity === "current") && (
                <FormStepperWrapper className="my-0">
                  {subGroups.map((subStep) => (
                    <li className="p-0" key={subStep.subGroupId}>
                      <UpdateFormStepperStep
                        title={subStep.title}
                        variant={subStep.variant}
                        className="pl-6"
                        onClick={() => {
                          dispatch(
                            updateProjectFormRenewableEnergyActions.stepNavigationRequested({
                              stepId: subStep.targetStepId,
                            }),
                          );
                        }}
                      />
                    </li>
                  ))}
                </FormStepperWrapper>
              )}
          </li>
        );
      })}
    </FormStepperWrapper>
  );
}

export default PhotovoltaicPowerPlantUpdateStepperSteps;
