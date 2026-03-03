import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

import SoilsTransformationIntroduction from "./SoilsTransformationIntroduction";

function SoilsTransformationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationIntroduction
      onNext={() => dispatch(navigateToNext())}
      onBack={() => dispatch(navigateToPrevious())}
    />
  );
}

export default SoilsTransformationIntroductionContainer;
