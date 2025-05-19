import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { scheduleCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectProjectScheduleInitialValues } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import ScheduleProjectionForm from "@/features/create-project/views/common-views/schedule/projection";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectProjectScheduleInitialValues);

  return (
    <ScheduleProjectionForm
      initialValues={initialValues}
      installationScheduleLabel="🏘️ Aménagement du site"
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onSubmit={(data) => {
        dispatch(scheduleCompleted(data));
      }}
    />
  );
}

export default ScheduleProjectionFormContainer;
