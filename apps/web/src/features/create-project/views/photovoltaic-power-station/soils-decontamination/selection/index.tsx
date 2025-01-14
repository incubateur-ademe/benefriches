import {
  completeSoilsDecontaminationSelection,
  revertSoilsDecontaminationSelectionStep,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationSelection, {
  FormValues,
} from "../../../common-views/soils-decontamination/selection/SoilsDecontaminationSelection";

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
