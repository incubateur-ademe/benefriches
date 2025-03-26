import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { buildingsUseIntroductionCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import BuildingsUseIntroduction from "./BuildingsUseIntroduction";

export default function BuildingsUseIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <BuildingsUseIntroduction
      onNext={() => {
        dispatch(buildingsUseIntroductionCompleted());
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}
