import {
  greenSpacesIntroductionCompleted,
  greenSpacesIntroductionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectSpaceCategorySurfaceArea } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanGreenSpacesIntroduction from "./UrbanGreenSpacesIntroduction";

export default function UrbanGreenSpacesIntroductionContainer() {
  const dispatch = useAppDispatch();
  const greenSpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "GREEN_SPACES"),
  );

  return (
    <UrbanGreenSpacesIntroduction
      greenSpacesSurfaceArea={greenSpacesSurfaceArea}
      onBack={() => {
        dispatch(greenSpacesIntroductionReverted());
      }}
      onNext={() => {
        dispatch(greenSpacesIntroductionCompleted());
      }}
    />
  );
}
