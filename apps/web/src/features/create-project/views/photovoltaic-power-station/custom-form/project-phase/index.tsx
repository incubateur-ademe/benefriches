import { RENEWABLE_ENERGY_PROJECT_PHASE_VALUES } from "shared";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeProjectPhaseStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import {
  getHintTextForRenewableEnergyProjectPhase,
  getLabelForRenewableEnergyProjectPhase,
  getPictogramForProjectPhase,
} from "@/shared/core/projectPhase";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectPhaseForm from "../../../common-views/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();
  const initialValue = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.creationData.projectPhase,
  );

  const options = RENEWABLE_ENERGY_PROJECT_PHASE_VALUES.map((phase) => ({
    value: phase,
    label: getLabelForRenewableEnergyProjectPhase(phase),
    hintText: getHintTextForRenewableEnergyProjectPhase(phase),
    pictogram: getPictogramForProjectPhase(phase),
  }));

  return (
    <ProjectPhaseForm
      initialValues={initialValue && { phase: initialValue }}
      projectPhaseOptions={options}
      onSubmit={({ phase }) => {
        dispatch(completeProjectPhaseStep({ phase: phase ?? "unknown" }));
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;
