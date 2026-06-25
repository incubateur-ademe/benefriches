import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectInvolvesReinstatementViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-decontamination/involves-reinstatement/involvesReinstatement.selectors";
import InvolvesReinstatementForm from "@/shared/views/project-form/urban-project/soils/involves-reinstatement/InvolvesReinstatementForm";

export default function InvolvesReinstatementContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectInvolvesReinstatementViewData);

  return (
    <InvolvesReinstatementForm
      onSubmit={(formData) => {
        dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
            answers: {
              involvesReinstatement: formData.involvesReinstatement === "yes",
            },
          }),
        );
      }}
      onBack={() => dispatch(previousStepRequested())}
      initialValues={initialValues}
    />
  );
}
