import {
  publicSpacesIntroductionCompleted,
  publicSpacesIntroductionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectSpaceCategorySurfaceArea } from "@/features/create-project/application/urban-project/urbanProject.selectors";
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
