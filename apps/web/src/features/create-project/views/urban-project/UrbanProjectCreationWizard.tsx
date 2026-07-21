import { lazy, Suspense, useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { selectUrbanProjectCreationWizardViewData } from "../../core/createProject.selectors";
import NavigationBlockerDialog from "../NavigationBlockerDialog";
import { HTML_MAIN_TITLE } from "../mainHtmlTitle";
import { useSyncCreationStepWithRouteQuery } from "../useSyncCreationStepWithRouteQuery";
import { URBAN_PROJECT_CREATION_STEP_QUERY_STRING_MAP } from "./creationStepQueryStringMap";
import { getUrbanProjectStepView } from "./stepToComponent";

const AnswerCascadingUpdateDialog = lazy(
  () => import("@/features/create-project/views/project-form/AnswerCascadingUpdateDialog"),
);

const HTML_URBAN_PROJECT_FORM_MAIN_TITLE = `Projet urbain - ${HTML_MAIN_TITLE}`;

function UrbanProjectCreationWizard() {
  const { currentStep, saveState } = useAppSelector(selectUrbanProjectCreationWizardViewData);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useSyncCreationStepWithRouteQuery(URBAN_PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {getUrbanProjectStepView(currentStep, {
        mainTitle: HTML_URBAN_PROJECT_FORM_MAIN_TITLE,
        mode: "creation",
      })}
      <AnswerCascadingUpdateDialog />
      <NavigationBlockerDialog shouldBlock={saveState !== "success"} />
    </Suspense>
  );
}

export default UrbanProjectCreationWizard;
