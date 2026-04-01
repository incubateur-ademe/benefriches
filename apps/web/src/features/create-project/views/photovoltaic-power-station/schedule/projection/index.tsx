import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVScheduleProjectionViewData } from "@/features/create-project/core/renewable-energy/step-handlers/schedule/schedule-projection/scheduleProjection.selector";
import ScheduleProjectionForm from "@/shared/views/project-form/common/schedule/projection/ScheduleProjectionForm";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, siteIsFriche } = useAppSelector(selectPVScheduleProjectionViewData);

  return (
    <ScheduleProjectionForm
      initialValues={initialValues}
      installationScheduleLabel="⚡️ Installation de la centrale photovoltaïque"
      hasReinstatement={siteIsFriche}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
      onSubmit={(data) => {
        dispatch(
          stepCompletionRequested({
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
