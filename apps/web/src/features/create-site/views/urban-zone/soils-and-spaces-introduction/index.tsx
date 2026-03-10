import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import SoilsAndSpacesIntroduction from "./SoilsAndSpacesIntroduction";

function SoilsAndSpacesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsAndSpacesIntroduction
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default SoilsAndSpacesIntroductionContainer;
