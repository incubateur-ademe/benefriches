import FricheSoilIntroduction from "./FricheSoilIntroduction";

import { goToNextStep } from "@/features/create-site/application/createFriche.reducers";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function FricheSoilIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <FricheSoilIntroduction onNext={() => dispatch(goToNextStep())} />;
}

export default FricheSoilIntroductionContainer;
