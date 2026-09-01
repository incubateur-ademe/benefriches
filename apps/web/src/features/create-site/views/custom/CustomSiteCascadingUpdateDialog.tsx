import { useAppSelector } from "@/app/hooks/store.hooks";
import type { CustomAnswerStepId } from "@/features/create-site/core/custom/customSteps";
import CascadingChangesAlertDialog from "@/shared/views/components/CascadingChangesAlertDialog/CascadingChangesAlertDialog";

import { useCustomSiteForm } from "../site-form/useCustomSiteForm";
import { getCustomStepDialogLabel } from "./customStepLabels";

// Cascading-update confirmation dialog for the custom site flow (creation today, update in
// tickets 10/11 through the same mode-blind handler + lens). Mirrors the project side's
// `AnswerCascadingUpdateDialog`: reads the pending change parked by the engine (see
// customForm.reducer.ts / stepCompletionRequested) and wires the shared, wizard-agnostic
// presentational dialog to the custom form's own confirm/cancel dispatchers.
export default function CustomSiteCascadingUpdateDialog() {
  const { selectPendingStepCompletion, onConfirmStepCompletion, onCancelStepCompletion } =
    useCustomSiteForm();

  const pendingStepCompletion = useAppSelector(selectPendingStepCompletion);

  if (!pendingStepCompletion?.showAlert) return null;

  return (
    <CascadingChangesAlertDialog<CustomAnswerStepId>
      cascadingChanges={pendingStepCompletion.changes.cascadingChanges}
      showAlert={pendingStepCompletion.showAlert}
      getStepLabel={getCustomStepDialogLabel}
      onConfirm={onConfirmStepCompletion}
      onCancel={onCancelStepCompletion}
    />
  );
}
