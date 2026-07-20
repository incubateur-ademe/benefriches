import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import { updateProjectFormRenewableEnergyActions } from "../../core/updateProject.actions";
import { selectPhotovoltaicPowerPlantUpdateStepperDataView } from "../../core/updateProjectRenewableEnergy.selectors";
import UpdateFormStepperStep from "../UpdateFormStepperStep";

function PhotovoltaicPowerPlantUpdateStepperSteps() {
  const dispatch = useAppDispatch();
  const { stepGroups } = useAppSelector(selectPhotovoltaicPowerPlantUpdateStepperDataView);

  return (
    <FormStepperWrapper className="my-0">
      {stepGroups.map(({ groupId, title, targetStepId, validation, activity }) => (
        <li className="p-0" key={groupId}>
          <UpdateFormStepperStep
            title={title}
            variant={{ validation, activity }}
            onClick={() => {
              dispatch(
                updateProjectFormRenewableEnergyActions.stepNavigationRequested({
                  stepId: targetStepId,
                }),
              );
            }}
          />
        </li>
      ))}
    </FormStepperWrapper>
  );
}

export default PhotovoltaicPowerPlantUpdateStepperSteps;
