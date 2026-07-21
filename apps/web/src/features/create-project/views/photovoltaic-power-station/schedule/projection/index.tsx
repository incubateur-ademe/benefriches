import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import ScheduleProjectionForm from "@/features/create-project/views/project-form/common/schedule/projection/ScheduleProjectionForm";

function ScheduleProjectionFormContainer() {
  const { onBack, onRequestStepCompletion, selectPVScheduleProjectionViewData } =
    useRenewableEnergyForm();
  const { initialValues, hasReinstatement } = useAppSelector(selectPVScheduleProjectionViewData);

  return (
    <ScheduleProjectionForm
      initialValues={initialValues}
      installationScheduleLabel="⚡️ Installation de la centrale photovoltaïque"
      hasReinstatement={hasReinstatement}
      onBack={onBack}
      onSubmit={(data) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
          answers: {
            firstYearOfOperation: data.firstYearOfOperation,
            photovoltaicInstallationSchedule: data.installationSchedule,
            reinstatementSchedule: data.reinstatementSchedule,
          },
        });
      }}
    />
  );
}

export default ScheduleProjectionFormContainer;
