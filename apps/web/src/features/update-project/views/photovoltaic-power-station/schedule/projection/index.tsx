import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import ScheduleProjectionForm from "@/features/create-project/views/project-form/common/schedule/projection/ScheduleProjectionForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVScheduleProjectionViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, hasReinstatement } = useAppSelector(selectPVScheduleProjectionViewData);

  return (
    <ScheduleProjectionForm
      initialValues={initialValues}
      installationScheduleLabel="⚡️ Installation de la centrale photovoltaïque"
      hasReinstatement={hasReinstatement}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
      onSubmit={(data) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
            answers: {
              firstYearOfOperation: data.firstYearOfOperation,
              photovoltaicInstallationSchedule: data.installationSchedule,
              reinstatementSchedule: data.reinstatementSchedule,
            },
          }),
        );
      }}
    />
  );
}

export default ScheduleProjectionFormContainer;
