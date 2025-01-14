import {
  livingAndActivitySpacesIntroductionCompleted,
  livingAndActivitySpacesIntroductionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectSpaceCategorySurfaceArea } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import LivingAndActivitySpacesIntroduction from "./LivingAndActivitySpacesIntroduction";

export default function LivingAndActivitySpacesIntroductionContainer() {
  const dispatch = useAppDispatch();
  const livingAndActivitySpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "LIVING_AND_ACTIVITY_SPACES"),
  );

  return (
    <LivingAndActivitySpacesIntroduction
      livingAndActivitySpacesSurfaceArea={livingAndActivitySpacesSurfaceArea}
      onBack={() => {
        dispatch(livingAndActivitySpacesIntroductionReverted());
      }}
      onNext={() => {
        dispatch(livingAndActivitySpacesIntroductionCompleted());
      }}
    />
  );
}
