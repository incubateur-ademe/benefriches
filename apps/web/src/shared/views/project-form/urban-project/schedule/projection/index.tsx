import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import ScheduleProjectionForm from "@/shared/views/project-form/common/schedule/projection/ScheduleProjectionForm";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ScheduleProjectionFormContainer() {
  const { onBack, selectStepAnswers, onRequestStepCompletion, selectIsSiteFriche } =
    useProjectForm();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_SCHEDULE_PROJECTION"));
  const isSiteFriche = useAppSelector(selectIsSiteFriche);

  return (
    <ScheduleProjectionForm
      installationScheduleLabel="🏘️️ Aménagement du site"
      hasReinstatement={isSiteFriche}
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
