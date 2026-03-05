import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectUrbanProjectExpressSummaryViewData } from "@/features/create-project/core/createProject.selectors";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { expressUrbanProjectSaved } from "@/features/create-project/core/urban-project/urbanProjectExpressSaved.action";
import ProjectExpressSummary from "@/shared/views/project-form/common/summary/ExpressSummary";

import { useStepBack } from "../useStepBack";

function ProjectExpressSummaryContainer() {
  const dispatch = useAppDispatch();
  const { loadingState, data, siteName } = useAppSelector(selectUrbanProjectExpressSummaryViewData);

  const onNext = () => {
    void dispatch(expressUrbanProjectSaved());
    void dispatch(creationProjectFormUrbanActions.nextStepRequested());
  };
  const onBack = useStepBack();

  return (
    <ProjectExpressSummary
      onBack={onBack}
      projectData={data}
      onNext={onNext}
      loadingState={loadingState}
      siteName={siteName}
    />
  );
}

export default ProjectExpressSummaryContainer;
