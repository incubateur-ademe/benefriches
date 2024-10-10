import {
  spacesDevelopmentPlanIntroductionCompleted,
  spacesDevelopmentPlanIntroductionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import UrbanSpacesDevelopmentPlanIntroduction from "./UrbanSpacesDevelopmentPlanIntroduction";

export default function UrbanSpacesDevelopmentPlanIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanSpacesDevelopmentPlanIntroduction
      onBack={() => {
        dispatch(spacesDevelopmentPlanIntroductionReverted());
      }}
      onNext={() => {
        dispatch(spacesDevelopmentPlanIntroductionCompleted());
      }}
    />
  );
}
