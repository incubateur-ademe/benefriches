import {
  spacesIntroductionCompleted,
  spacesIntroductionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import UrbanProjectSpacesIntroduction from "./SpacesIntroduction";

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
