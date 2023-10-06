import { setPermeableArtificializedSoilDistribution } from "@/features/create-site/application/createFriche.reducers";
import {
  FricheSite,
  FricheSpaceType,
  PermeableArtificializedSoil,
  PermeableArtificializedSoilSpace,
} from "@/features/create-site/domain/friche.types";
import { AppDispatch } from "@/store";

type SubmitData = Partial<Record<PermeableArtificializedSoil, number>>;

export const buildViewModel = (
  dispatch: AppDispatch,
  fricheData: Partial<FricheSite>,
) => {
  const permeableArtificialSoilSpace = fricheData.spaces?.find(
    (space) => space.type === FricheSpaceType.PERMEABLE_ARTIFICIAL_SOILS,
  ) as PermeableArtificializedSoilSpace | undefined;

  const permeableArtificializedSoils =
    permeableArtificialSoilSpace?.soilComposition?.map((s) => s.type) ?? [];

  return {
    permeableArtificializedSoils,
    onSubmit: (data: SubmitData) => {
      dispatch(setPermeableArtificializedSoilDistribution(data));
    },
  };
};
