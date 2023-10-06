import { setPermeableArtificializedSoilComposition } from "@/features/create-site/application/createFriche.reducers";
import { PermeableArtificializedSoil } from "@/features/create-site/domain/friche.types";
import { AppDispatch } from "@/store";

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
