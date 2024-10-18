import {
  soilsDecontaminationSelectionCompleted,
  soilsDecontaminationSelectionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import SoilsDecontaminationSelection, {
  FormValues,
} from "@/features/create-project/views/common-views/soils-decontamination/selection/SoilsDecontaminationSelection";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SoilsDecontaminationSelectionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsDecontaminationSelection
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
