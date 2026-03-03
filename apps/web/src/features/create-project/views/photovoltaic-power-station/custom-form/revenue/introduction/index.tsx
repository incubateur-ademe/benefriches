import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectRevenueIntroduction
      onNext={() => {
        dispatch(navigateToNext());
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default ProjectRevenueIntroductionContainer;
