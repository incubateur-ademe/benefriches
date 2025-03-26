import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { greenSpacesIntroductionCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectSpaceCategorySurfaceArea } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
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
        dispatch(stepRevertAttempted());
      }}
      onNext={() => {
        dispatch(greenSpacesIntroductionCompleted());
      }}
    />
  );
}
