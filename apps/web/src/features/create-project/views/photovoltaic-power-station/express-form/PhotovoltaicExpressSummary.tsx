import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { expressPhotovoltaicProjectSaved } from "@/features/create-project/core/renewable-energy/actions/expressProjectSaved.action";
import ProjectExpressSummary from "@/shared/views/project-form/common/summary/ExpressSummary";

function ProjectExpressSummaryContainer() {
  const dispatch = useAppDispatch();
  const { renewableEnergyProject, siteData } = useAppSelector((state) => state.projectCreation);
  const { loadingState, projectData } = renewableEnergyProject.expressData;

  const onBack = () => {
    dispatch(stepReverted());
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
