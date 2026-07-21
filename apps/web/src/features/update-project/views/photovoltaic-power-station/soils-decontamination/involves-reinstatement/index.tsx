import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import InvolvesReinstatementForm from "@/features/create-project/views/urban-project/soils/involves-reinstatement/InvolvesReinstatementForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectInvolvesReinstatementViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

export default function InvolvesReinstatementContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectInvolvesReinstatementViewData);

  return (
    <InvolvesReinstatementForm
      onSubmit={(formData) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
            answers: {
              involvesReinstatement: formData.involvesReinstatement === "yes",
            },
          }),
        );
      }}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
      initialValues={initialValues}
    />
  );
}
