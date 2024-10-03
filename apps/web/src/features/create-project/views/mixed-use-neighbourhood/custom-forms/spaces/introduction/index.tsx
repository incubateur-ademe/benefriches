import UrbanProjectSpacesIntroduction from "./SpacesIntroduction";

import {
  spacesIntroductionCompleted,
  spacesIntroductionReverted,
} from "@/features/create-project/application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

export default function UrbanProjectSpacesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanProjectSpacesIntroduction
      onBack={() => {
        dispatch(spacesIntroductionReverted());
      }}
      onNext={() => {
        dispatch(spacesIntroductionCompleted());
      }}
    />
  );
}
