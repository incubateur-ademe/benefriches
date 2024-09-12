import SoilsDecontaminationSelection, { FormValues } from "./SoilsDecontaminationSelection";

import {
  completeSoilsDecontaminationSelection,
  revertSoilsDecontaminationSelectionStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SoilsDecontaminationSelectionContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    dispatch(completeSoilsDecontaminationSelection(data.decontaminationSelection));
  };

  return (
    <SoilsDecontaminationSelection
      onSubmit={onSubmit}
      onBack={() => dispatch(revertSoilsDecontaminationSelectionStep())}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;
