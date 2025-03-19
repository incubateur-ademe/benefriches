import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { stepRevertCancelled, stepRevertConfirmed } from "../../core/actions/revert.actions";
import { selectShouldConfirmStepRevert } from "../../core/selectors/createSite.selectors";
import StepRevertConfirmationModal from "./StepRevertConfirmationModal";

export default function StepRevertConfirmationModalContainer() {
  const open = useAppSelector(selectShouldConfirmStepRevert);
  const dispatch = useAppDispatch();

  return (
    <StepRevertConfirmationModal
      open={open}
      onConfirm={({ doNotAskAgain }: { doNotAskAgain: boolean }) => {
        dispatch(stepRevertConfirmed({ doNotAskAgain }));
      }}
      onCancel={({ doNotAskAgain }: { doNotAskAgain: boolean }) => {
        dispatch(stepRevertCancelled({ doNotAskAgain }));
      }}
    />
  );
}
