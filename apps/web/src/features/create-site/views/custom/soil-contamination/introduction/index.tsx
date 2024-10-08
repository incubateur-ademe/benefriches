import { revertSoilContaminationIntroductionStep } from "@/features/create-site/application/createSite.actions";
import { completeSoilsContaminationIntroductionStep } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SoilContaminationIntroduction from "./SoilContaminationIntroduction";

function SoilContaminationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilContaminationIntroduction
      onBack={() => {
        dispatch(revertSoilContaminationIntroductionStep());
      }}
      onNext={() => {
        dispatch(completeSoilsContaminationIntroductionStep());
      }}
    />
  );
}

export default SoilContaminationIntroductionContainer;
