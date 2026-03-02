import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSoilsDecontaminationSelection } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import SoilsDecontaminationSelection, {
  FormValues,
} from "@/shared/views/project-form/common/soils-decontamination/selection/SoilsDecontaminationSelection";

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
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;
