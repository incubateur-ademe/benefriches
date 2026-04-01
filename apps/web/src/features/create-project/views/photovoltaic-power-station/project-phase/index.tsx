import { RENEWABLE_ENERGY_PROJECT_PHASE_VALUES } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectProjectPhaseViewData } from "@/features/create-project/core/renewable-energy/step-handlers/project-phase/project-phase/projectPhase.selectors";
import {
  getHintTextForRenewableEnergyProjectPhase,
  getLabelForRenewableEnergyProjectPhase,
  getPictogramForProjectPhase,
} from "@/shared/core/projectPhase";
import ProjectPhaseForm from "@/shared/views/project-form/common/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectProjectPhaseViewData);

  const options = RENEWABLE_ENERGY_PROJECT_PHASE_VALUES.map((phase) => ({
    value: phase,
    label: getLabelForRenewableEnergyProjectPhase(phase),
    hintText: getHintTextForRenewableEnergyProjectPhase(phase),
    pictogram: getPictogramForProjectPhase(phase),
  }));

  return (
    <ProjectPhaseForm
      initialValues={initialValues}
      projectPhaseOptions={options}
      onSubmit={({ phase }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_PROJECT_PHASE",
            answers: { phase: phase ?? "unknown" },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;
