import { useAppDispatch } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { urbanZoneLandParcelsIntroductionCompleted } from "@/features/create-site/core/steps/urban-zone/urbanZone.actions";

import LandParcelsIntroduction from "./LandParcelsIntroduction";

function LandParcelsIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <LandParcelsIntroduction
      onNext={() => dispatch(urbanZoneLandParcelsIntroductionCompleted())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default LandParcelsIntroductionContainer;
