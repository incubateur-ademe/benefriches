import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { creationRenewableEnergyFormActions } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { creationRenewableEnergyFormSelectors } from "@/features/create-project/core/renewable-energy/renewableEnergyProject.selectors";
import type { AnswerStepId } from "@/features/create-project/core/renewable-energy/renewableEnergySteps";
import {
  RENEWABLE_ENERGY_STEP_GROUP_LABELS,
  RENEWABLE_ENERGY_STEP_TO_GROUP,
} from "@/features/create-project/core/renewable-energy/step-handlers/renewableEnergyStepperConfig";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { updateRenewableEnergyFormSelectors } from "@/features/update-project/core/updateProject.selectors";

import CascadingChangesAlertDialog from "../project-form/CascadingChangesAlertDialog";

const getStepLabel = (stepId: AnswerStepId): string => {
  const { groupId } = RENEWABLE_ENERGY_STEP_TO_GROUP[stepId];
  return RENEWABLE_ENERGY_STEP_GROUP_LABELS[groupId];
};

type Props = {
  mode: "create" | "update";
};

// Renewable-energy cascading-update confirmation dialog. Wires the shared presentational dialog to
// whichever slice (creation `state.projectCreation` or update `state.projectUpdate`) is active,
// mirroring urban's `AnswerCascadingUpdateDialog`.
export default function RenewableEnergyCascadingUpdateDialog({ mode }: Props) {
  const dispatch = useAppDispatch();

  const selectPendingStepCompletion =
    mode === "create"
      ? creationRenewableEnergyFormSelectors.selectPendingStepCompletion
      : updateRenewableEnergyFormSelectors.selectPendingStepCompletion;

  const actions =
    mode === "create"
      ? creationRenewableEnergyFormActions
      : updateProjectFormRenewableEnergyActions;

  const pendingStepCompletion = useAppSelector(selectPendingStepCompletion);

  const onConfirm = useCallback(
    () => dispatch(actions.stepCompletionConfirmed()),
    [dispatch, actions],
  );
  const onCancel = useCallback(
    () => dispatch(actions.stepCompletionCancelled()),
    [dispatch, actions],
  );

  if (!pendingStepCompletion?.showAlert) return null;

  return (
    <CascadingChangesAlertDialog<AnswerStepId>
      cascadingChanges={pendingStepCompletion.changes.cascadingChanges}
      showAlert={pendingStepCompletion.showAlert}
      getStepLabel={getStepLabel}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
