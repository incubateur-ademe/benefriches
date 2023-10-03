import {
  FricheSite,
  FricheSpaceType,
} from "@/components/pages/SiteFoncier/friche";
import { setSpacesSurfaceArea } from "@/store/features/friche-creation/fricheCreation";
import { AppDispatch } from "@/store/store";

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
