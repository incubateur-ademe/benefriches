import {
  publicSpacesIntroductionCompleted,
  publicSpacesIntroductionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectSpaceCategorySurfaceArea } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PublicSpacesIntroduction from "./PublicSpacesIntroduction";

export default function PublicSpacesIntroductionContainer() {
  const dispatch = useAppDispatch();
  const publicSpacesSurfaceArea = useAppSelector((state) =>
    selectSpaceCategorySurfaceArea(state, "PUBLIC_SPACES"),
  );

  return (
    <PublicSpacesIntroduction
      publicSpacesSurfaceArea={publicSpacesSurfaceArea}
      onBack={() => {
        dispatch(publicSpacesIntroductionReverted());
      }}
      onNext={() => {
        dispatch(publicSpacesIntroductionCompleted());
      }}
    />
  );
}
