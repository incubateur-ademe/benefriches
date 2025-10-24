import { selectSiteData } from "@/features/create-project/core/createProject.selectors";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { expressUrbanProjectSaved } from "@/features/create-project/core/urban-project/urbanProjectExpressSaved.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import ProjectExpressSummary from "@/shared/views/project-form/common/summary/ExpressSummary";

import { useStepBack } from "../useStepBack";

function ProjectExpressSummaryContainer() {
  const dispatch = useAppDispatch();
  const { loadingState = "idle", data } =
    useAppSelector(
      (state) => state.projectCreation.urbanProject.steps.URBAN_PROJECT_EXPRESS_SUMMARY,
    ) ?? {};
  const siteData = useAppSelector(selectSiteData);

  const onNext = () => {
    void dispatch(expressUrbanProjectSaved());
    void dispatch(creationProjectFormUrbanActions.navigateToNext());
  };
  const onBack = useStepBack();

  return (
    <ProjectExpressSummary
      onBack={onBack}
      projectData={data}
      onNext={onNext}
      loadingState={loadingState}
      siteName={siteData?.name ?? ""}
    />
  );
}

export default ProjectExpressSummaryContainer;
