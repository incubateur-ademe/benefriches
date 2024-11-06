import {
  completeScheduleStep,
  revertScheduleStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ScheduleProjectionForm from "../../../common-views/schedule/projection";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ScheduleProjectionForm
      installationScheduleLabel="Installation de la centrale photovoltaïque"
      onBack={() => {
        dispatch(revertScheduleStep());
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
