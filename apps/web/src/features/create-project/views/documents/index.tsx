import ProjectDocumentsPage from "./ProjectDocumentsPage";

import {
  goToStep,
  ProjectCreationStep,
} from "@/features/create-project/application/createProject.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function ProjectDocumentsContainer() {
  const dispatch = useAppDispatch();

  const siteName = useAppSelector(
    (state) => state.projectCreation.siteData?.name ?? "",
  );

  return (
    <ProjectDocumentsPage
      siteName={siteName}
      documents={["BUILDING_PERMIT", "FORECAST_BALANCE_SHEET"]}
      onNext={() =>
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_KEY_PARAMETER))
      }
    />
  );
}

export default ProjectDocumentsContainer;
