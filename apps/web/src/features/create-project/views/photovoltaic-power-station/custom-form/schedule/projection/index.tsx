import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeScheduleStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationScheduleInitialValues } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ScheduleProjectionForm from "../../../../common-views/schedule/projection";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectPhotovoltaicPowerStationScheduleInitialValues);

  return (
    <ScheduleProjectionForm
      initialValues={initialValues}
      installationScheduleLabel="⚡️ Installation de la centrale photovoltaïque"
      onBack={() => {
        dispatch(stepRevertAttempted());
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
