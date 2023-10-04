import {
  FricheSite,
  FricheSpaceType,
  PermeableArtificializedSoil,
  PermeableArtificializedSoilSpace,
} from "@/components/pages/SiteFoncier/friche";
import { setPermeableArtificializedSoilDistribution } from "@/store/features/friche-creation/fricheCreation";
import { AppDispatch } from "@/store/store";

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
