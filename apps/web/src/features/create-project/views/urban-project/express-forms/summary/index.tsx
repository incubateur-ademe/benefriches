import { selectSiteData } from "@/features/create-project/core/createProject.selectors";
import { navigateToNext } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { expressUrbanProjectSaved } from "@/features/create-project/core/urban-project/urbanProjectExpressSaved.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectExpressSummary from "../../../common-views/summary/ExpressSummary";
import { useStepBack } from "../../custom-forms/useStepBack";

function ProjectExpressSummaryContainer() {
  const dispatch = useAppDispatch();
  const { loadingState = "idle", projectData } =
    useAppSelector(
      (state) => state.projectCreation.urbanProject.steps.URBAN_PROJECT_EXPRESS_SUMMARY,
    ) ?? {};
  const siteData = useAppSelector(selectSiteData);

  const onNext = () => {
    void dispatch(expressUrbanProjectSaved());
    void dispatch(navigateToNext());
  };
  const onBack = useStepBack();

  return (
    <ProjectExpressSummary
      onBack={onBack}
      projectData={projectData}
      onNext={onNext}
      loadingState={loadingState}
      siteName={siteData?.name ?? ""}
    />
  );
}

export default ProjectExpressSummaryContainer;
