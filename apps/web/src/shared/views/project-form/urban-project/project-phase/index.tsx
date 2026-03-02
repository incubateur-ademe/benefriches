import { URBAN_PROJECT_PHASE_VALUES } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import {
  getHintTextForUrbanProjectPhase,
  getLabelForUrbanProjectPhase,
  getPictogramForProjectPhase,
} from "@/shared/core/projectPhase";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import ProjectPhaseForm from "../../common/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();

  const options = URBAN_PROJECT_PHASE_VALUES.map((phase) => ({
    value: phase,
    label: getLabelForUrbanProjectPhase(phase),
    hintText: getHintTextForUrbanProjectPhase(phase),
    pictogram: getPictogramForProjectPhase(phase),
  }));

  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_PROJECT_PHASE"));

  return (
    <ProjectPhaseForm
      projectPhaseOptions={options}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_PROJECT_PHASE",
          answers: {
            projectPhase: formData.phase,
          },
        });
      }}
      onBack={onBack}
      initialValues={{ phase: stepAnswers?.projectPhase }}
    />
  );
}

export default ProjectPhaseFormContainer;
