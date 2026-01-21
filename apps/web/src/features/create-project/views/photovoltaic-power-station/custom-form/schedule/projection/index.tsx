import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { selectIsSiteFriche } from "@/features/create-project/core/createProject.selectors";
import { completeScheduleStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationScheduleInitialValues } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import ScheduleProjectionForm from "@/shared/views/project-form/common/schedule/projection/ScheduleProjectionForm";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectPhotovoltaicPowerStationScheduleInitialValues);
  const siteIsFriche = useAppSelector(selectIsSiteFriche);

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
