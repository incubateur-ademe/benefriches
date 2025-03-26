import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { spacesDevelopmentPlanIntroductionCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import UrbanSpacesDevelopmentPlanIntroduction from "./UrbanSpacesDevelopmentPlanIntroduction";

export default function UrbanSpacesDevelopmentPlanIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanSpacesDevelopmentPlanIntroduction
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onNext={() => {
        dispatch(spacesDevelopmentPlanIntroductionCompleted());
      }}
    />
  );
}
