import { RENEWABLE_ENERGY_PROJECT_PHASE_VALUES } from "shared";

import {
  completeProjectPhaseStep,
  revertProjectPhaseStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import {
  getHintTextForRenewableEnergyProjectPhase,
  getLabelForRenewableEnergyProjectPhase,
} from "@/shared/domain/projectPhase";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectPhaseForm from "../../common-views/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();

  const options = RENEWABLE_ENERGY_PROJECT_PHASE_VALUES.map((phase) => ({
    value: phase,
    label: getLabelForRenewableEnergyProjectPhase(phase),
    hintText: getHintTextForRenewableEnergyProjectPhase(phase),
  }));

  return (
    <ProjectPhaseForm
      projectPhaseOptions={options}
      onSubmit={({ phase }) => {
        dispatch(completeProjectPhaseStep({ phase: phase ?? "unknown" }));
      }}
      onBack={() => {
        dispatch(revertProjectPhaseStep());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;
