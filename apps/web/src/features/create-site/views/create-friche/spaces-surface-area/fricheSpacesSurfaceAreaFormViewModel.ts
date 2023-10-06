import { setSpacesSurfaceArea } from "@/features/create-site/application/createFriche.reducers";
import {
  FricheSite,
  FricheSpaceType,
} from "@/features/create-site/domain/friche.types";
import { AppDispatch } from "@/store";

type FormData = Partial<Record<FricheSpaceType, number>>;

export const buildViewModel = (
  dispatch: AppDispatch,
  fricheData: Partial<FricheSite>,
) => {
  return {
    spaces: fricheData.spaces?.map((space) => space.type) ?? [],
    onSubmit: (formData: FormData) => {
      const spacesSurfaceArea = Object.entries(formData).map(
        ([type, surface]) => ({
          type: type as FricheSpaceType,
          surface,
        }),
      );
      dispatch(setSpacesSurfaceArea(spacesSurfaceArea));
    },
  };
};
