import { stepRevertConfirmationResolved } from "@/features/create-project/core/actions/actionsUtils";
import { selectShouldConfirmStepRevert } from "@/features/create-project/core/createProject.selectors";
import StepRevertConfirmationModal from "@/features/create-site/views/step-revert-confirmation-modal/StepRevertConfirmationModal";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
