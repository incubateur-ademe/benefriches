import {
  scheduleCompleted,
  scheduleReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectProjectScheduleInitialValues } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import ScheduleProjectionForm from "@/features/create-project/views/common-views/schedule/projection";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectProjectScheduleInitialValues);

  return (
    <ScheduleProjectionForm
      initialValues={initialValues}
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
