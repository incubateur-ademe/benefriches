import { requestStepCompletion } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import ScheduleProjectionForm from "@/features/create-project/views/common-views/schedule/projection";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";

function ScheduleProjectionFormContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_SCHEDULE_PROJECTION"));

  const onBack = useStepBack();
  return (
    <ScheduleProjectionForm
      installationScheduleLabel="🏘️ Aménagement du site"
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION",
            answers: {
              installationSchedule: formData.installationSchedule,
              reinstatementSchedule: formData.reinstatementSchedule,
              firstYearOfOperation: formData.firstYearOfOperation,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={
        stepAnswers?.installationSchedule && stepAnswers.firstYearOfOperation
          ? {
              installation: {
                startDate: new Date(stepAnswers.installationSchedule.startDate),
                endDate: new Date(stepAnswers.installationSchedule.endDate),
              },
              reinstatement: stepAnswers.reinstatementSchedule
                ? {
                    startDate: new Date(stepAnswers.reinstatementSchedule.startDate),
                    endDate: new Date(stepAnswers.reinstatementSchedule.endDate),
                  }
                : undefined,
              firstYearOfOperations: stepAnswers.firstYearOfOperation,
            }
          : undefined
      }
    />
  );
}

export default ScheduleProjectionFormContainer;
