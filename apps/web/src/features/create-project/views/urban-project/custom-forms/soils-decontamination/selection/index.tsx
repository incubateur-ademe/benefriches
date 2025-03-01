import {
  soilsDecontaminationSelectionCompleted,
  soilsDecontaminationSelectionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import SoilsDecontaminationSelection, {
  FormValues,
} from "@/features/create-project/views/common-views/soils-decontamination/selection/SoilsDecontaminationSelection";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SoilsDecontaminationSelectionContainer() {
  const decontaminationPlan = useAppSelector(
    (state) => state.projectCreation.urbanProject.creationData.decontaminationPlan,
  );
  const dispatch = useAppDispatch();

  return (
    <SoilsDecontaminationSelection
      initialValues={{
        decontaminationSelection: decontaminationPlan ?? null,
      }}
      onSubmit={(data: FormValues) => {
        dispatch(
          soilsDecontaminationSelectionCompleted(data.decontaminationSelection ?? "unknown"),
        );
      }}
      onBack={() => dispatch(soilsDecontaminationSelectionReverted())}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;
