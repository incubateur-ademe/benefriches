import { URBAN_PROJECT_PHASE_VALUES } from "shared";

import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import {
  getHintTextForUrbanProjectPhase,
  getLabelForUrbanProjectPhase,
  getPictogramForProjectPhase,
} from "@/shared/core/projectPhase";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectPhaseForm from "../../../common-views/project-phase/ProjectPhaseForm";
import { useStepBack } from "../useStepBack";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();

  const options = URBAN_PROJECT_PHASE_VALUES.map((phase) => ({
    value: phase,
    label: getLabelForUrbanProjectPhase(phase),
    hintText: getHintTextForUrbanProjectPhase(phase),
    pictogram: getPictogramForProjectPhase(phase),
  }));

  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_PROJECT_PHASE"));

  const onBack = useStepBack();
  return (
    <ProjectPhaseForm
      projectPhaseOptions={options}
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_PROJECT_PHASE",
            answers: {
              projectPhase: formData.phase,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{ phase: stepAnswers?.projectPhase }}
    />
  );
}

export default ProjectPhaseFormContainer;
