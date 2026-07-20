import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVScheduleProjectionViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";
import ScheduleProjectionForm from "@/shared/views/project-form/common/schedule/projection/ScheduleProjectionForm";

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
