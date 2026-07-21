import { lazy, Suspense, useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";
import { URBAN_PROJECT_CREATION_STEP_QUERY_STRING_MAP } from "@/features/create-project/views/urban-project/creationStepQueryStringMap";
import { getUrbanProjectStepView } from "@/features/create-project/views/urban-project/stepToComponent";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { selectUrbanProjectCurrentStep } from "../core/updateProject.selectors";
import NavigationBlockerDialog from "./NavigationBlockerDialog";
import UrbanProjectUpdateStepper from "./UrbanProjectUpdateStepper";
import { useSidebarActions } from "./useSidebarActions";
import { useSyncUpdateStepWithRouteQuery } from "./useSyncUpdateStepWithRouteQuery";

const AnswerCascadingUpdateDialog = lazy(
  () => import("@/features/create-project/views/project-form/AnswerCascadingUpdateDialog"),
);

const HTML_URBAN_PROJECT_FORM_MAIN_TITLE = `Projet urbain - Modification`;

function UrbanProjectUpdateView() {
  const currentStep = useAppSelector(selectUrbanProjectCurrentStep);
  const projectId = useAppSelector((state) => state.projectUpdate.projectData.id);
  const projectName = useAppSelector((state) => state.projectUpdate.projectData.projectName ?? "");
  const siteId = useAppSelector((state) => state.projectUpdate.siteData?.id);

  const { onSave, selectIsFormStatusValid, selectSaveState } = useProjectForm();
  const isFormValid = useAppSelector(selectIsFormStatusValid);
  const saveState = useAppSelector(selectSaveState);

  const sidebarActions = useSidebarActions({ onSave, isFormValid, saveState, projectId, siteId });

  useSyncUpdateStepWithRouteQuery(URBAN_PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <SidebarLayout
      title={`Modification du projet « ${projectName} »`}
      header="sticky"
      actions={sidebarActions}
      sidebarChildren={<UrbanProjectUpdateStepper step={currentStep} />}
      mainChildren={
        saveState === "loading" ? (
          <LoadingSpinner />
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            {getUrbanProjectStepView(currentStep, {
              mainTitle: HTML_URBAN_PROJECT_FORM_MAIN_TITLE,
              mode: "update",
            })}
            <AnswerCascadingUpdateDialog />
            <NavigationBlockerDialog />
          </Suspense>
        )
      }
    />
  );
}

export default UrbanProjectUpdateView;
