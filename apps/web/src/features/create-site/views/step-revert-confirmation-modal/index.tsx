import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { stepRevertConfirmationResolved } from "../../core/actions/revert.actions";
import { selectShouldConfirmStepRevert } from "../../core/selectors/createSite.selectors";
import StepRevertConfirmationModal from "./StepRevertConfirmationModal";

export default function StepRevertConfirmationModalContainer() {
  const open = useAppSelector(selectShouldConfirmStepRevert);
  const dispatch = useAppDispatch();

  return (
    <StepRevertConfirmationModal
      open={open}
      onConfirm={({ doNotAskAgain }: { doNotAskAgain: boolean }) => {
        dispatch(stepRevertConfirmationResolved({ confirmed: true, doNotAskAgain }));
      }}
      onCancel={({ doNotAskAgain }: { doNotAskAgain: boolean }) => {
        dispatch(stepRevertConfirmationResolved({ confirmed: false, doNotAskAgain }));
      }}
    />
  );
}
