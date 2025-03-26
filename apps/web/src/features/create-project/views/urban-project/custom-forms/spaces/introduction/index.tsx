import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { spacesIntroductionCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import UrbanProjectSpacesIntroduction from "./SpacesIntroduction";

export default function UrbanProjectSpacesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanProjectSpacesIntroduction
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onNext={() => {
        dispatch(spacesIntroductionCompleted());
      }}
    />
  );
}
