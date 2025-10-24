import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { expressPhotovoltaicProjectSaved } from "@/features/create-project/core/renewable-energy/actions/expressProjectSaved.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import ProjectExpressSummary from "@/shared/views/project-form/common/summary/ExpressSummary";

function ProjectExpressSummaryContainer() {
  const dispatch = useAppDispatch();
  const { renewableEnergyProject, siteData } = useAppSelector((state) => state.projectCreation);
  const { loadingState, projectData } = renewableEnergyProject.expressData;

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  const onNext = () => {
    void dispatch(expressPhotovoltaicProjectSaved());
  };

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
