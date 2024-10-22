import {
  buildingsUseIntroductionCompleted,
  buildingsUseIntroductionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
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
        dispatch(buildingsUseIntroductionReverted());
      }}
    />
  );
}
