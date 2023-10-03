import { PermeableArtificializedSoil } from "@/components/pages/SiteFoncier/friche";
import { setPermeableArtificializedSoilComposition } from "@/store/features/friche-creation/fricheCreation";
import { AppDispatch } from "@/store/store";

type SubmitData = {
  composition: PermeableArtificializedSoil[];
};

export const buildViewModel = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: SubmitData) => {
      dispatch(setPermeableArtificializedSoilComposition(data.composition));
    },
  };
};
