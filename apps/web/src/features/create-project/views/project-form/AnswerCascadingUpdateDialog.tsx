import { useAppSelector } from "@/app/hooks/store.hooks";
import {
  STEP_GROUP_LABELS,
  STEP_TO_GROUP_MAPPING,
} from "@/features/create-project/core/urban-project/stepperConfig";
import { AnswerStepId } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";
import CascadingChangesAlertDialog from "@/shared/views/components/CascadingChangesAlertDialog/CascadingChangesAlertDialog";

const getStepLabel = (stepId: AnswerStepId) => {
  const { groupId, subGroupId } = STEP_TO_GROUP_MAPPING[stepId];

  return subGroupId
    ? `${STEP_GROUP_LABELS[groupId]} → ${STEP_GROUP_LABELS[subGroupId]}`
    : STEP_GROUP_LABELS[groupId];
};

export default function CascadingChangesAlert() {
  const { onConfirmStepCompletion, onCancelStepCompletion, selectPendingStepCompletion } =
    useProjectForm();

  const pendingStepCompletion = useAppSelector(selectPendingStepCompletion);

  if (!pendingStepCompletion?.showAlert) return null;

  return (
    <CascadingChangesAlertDialog<AnswerStepId>
      cascadingChanges={pendingStepCompletion.changes.cascadingChanges}
      showAlert={pendingStepCompletion.showAlert}
      getStepLabel={getStepLabel}
      onConfirm={onConfirmStepCompletion}
      onCancel={onCancelStepCompletion}
    />
  );
}
