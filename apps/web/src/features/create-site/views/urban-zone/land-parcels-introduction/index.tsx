import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";

import LandParcelsIntroduction from "./LandParcelsIntroduction";

function LandParcelsIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <LandParcelsIntroduction
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default LandParcelsIntroductionContainer;
