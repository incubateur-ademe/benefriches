import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { selectProjectId } from "@/features/create-project/core/createProject.selectors";
import { reviewModeInitiated } from "@/features/create-project/core/reviewMode.reducer";
import { customUrbanProjectSaved } from "@/features/create-project/core/urban-project/actions/customUrbanProjectSaved.action";
import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import {
  getUrbanProjectSpaceDistribution,
  selectCreationData,
  selectUrbanProjectSoilsDistribution,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationDataSummary from "./ProjectCreationDataSummary";

function ProjectionCreationDataSummaryContainer() {
  const projectData = useAppSelector(selectCreationData);
  const projectId = useAppSelector(selectProjectId);

  const projectSoilsDistribution = useAppSelector(selectUrbanProjectSoilsDistribution);
  const spaceDistribution = useAppSelector(getUrbanProjectSpaceDistribution);

  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(customUrbanProjectSaved());
  };

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  const onExpensesAndRevenuesTitleClick = () => {
    dispatch(
      reviewModeInitiated({
        sectionToReview: "urbanProjectExpensesAndRevenues",
      }),
    );
  };

  return (
    <ProjectCreationDataSummary
      onNext={onNext}
      onBack={onBack}
      projectId={projectId}
      projectData={projectData}
      projectSoilsDistribution={projectSoilsDistribution}
      projectSpaces={spaceDistribution}
      getSectionButtonProps={(step: UrbanProjectCustomCreationStep) => {
        if (step === "URBAN_PROJECT_EXPENSES_INTRODUCTION") {
          return {
            iconId: "fr-icon-edit-box-line",
            children: "Modifier",
            onClick: () => {
              onExpensesAndRevenuesTitleClick();
            },
          };
        }
        return undefined;
      }}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;
