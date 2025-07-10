import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSoilsDecontaminationSelection } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationSelection, {
  FormValues,
} from "../../../../common-views/soils-decontamination/selection/SoilsDecontaminationSelection";

function SoilsDecontaminationSelectionContainer() {
  const dispatch = useAppDispatch();
  const decontaminationPlan = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.creationData.decontaminationPlan,
  );

  return (
    <SoilsDecontaminationSelection
      initialValues={{
        decontaminationSelection: decontaminationPlan ?? null,
      }}
      onSubmit={(data: FormValues) => {
        dispatch(completeSoilsDecontaminationSelection(data.decontaminationSelection ?? "unknown"));
      }}
      onBack={() => dispatch(stepRevertAttempted())}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;
