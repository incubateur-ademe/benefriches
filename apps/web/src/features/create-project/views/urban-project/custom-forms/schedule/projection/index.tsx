import {
  scheduleCompleted,
  scheduleReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import ScheduleProjectionForm from "@/features/create-project/views/common-views/schedule/projection";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ScheduleProjectionForm
      installationScheduleLabel="Travaux d’aménagement du quartier"
      onBack={() => {
        dispatch(scheduleReverted());
      }}
      onSubmit={(data) => {
        dispatch(scheduleCompleted(data));
      }}
    />
  );
}

export default ScheduleProjectionFormContainer;
