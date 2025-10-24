import ScheduleProjectionForm from "@/features/create-project/views/common-views/schedule/projection";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ScheduleProjectionFormContainer() {
  const { onBack, selectStepAnswers, onRequestStepCompletion } = useProjectForm();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_SCHEDULE_PROJECTION"));

  return (
    <ScheduleProjectionForm
      installationScheduleLabel="🏘️️ Aménagement du site"
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION",
          answers: {
            installationSchedule: formData.installationSchedule,
            reinstatementSchedule: formData.reinstatementSchedule,
            firstYearOfOperation: formData.firstYearOfOperation,
          },
        });
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
