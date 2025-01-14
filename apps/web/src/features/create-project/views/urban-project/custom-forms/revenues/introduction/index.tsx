import {
  revenueIntroductionCompleted,
  revenueIntroductionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectRevenueIntroduction
      onBack={() => {
        dispatch(revenueIntroductionReverted());
      }}
      onNext={() => {
        dispatch(revenueIntroductionCompleted());
      }}
    />
  );
}

export default ProjectRevenueIntroductionContainer;
