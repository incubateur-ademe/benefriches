import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeScheduleStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPVScheduleProjectionViewData } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
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
        dispatch(stepReverted());
      }}
      onSubmit={(data) => {
        dispatch(
          completeScheduleStep({
            firstYearOfOperation: data.firstYearOfOperation,
            photovoltaicInstallationSchedule: data.installationSchedule,
            reinstatementSchedule: data.reinstatementSchedule,
          }),
        );
      }}
    />
  );
}

export default ScheduleProjectionFormContainer;
