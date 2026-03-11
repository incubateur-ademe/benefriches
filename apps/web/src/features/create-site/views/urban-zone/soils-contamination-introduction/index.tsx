import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import UrbanZoneSoilsContaminationIntroduction from "./UrbanZoneSoilsContaminationIntroduction";

function SoilsContaminationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanZoneSoilsContaminationIntroduction
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default SoilsContaminationIntroductionContainer;
