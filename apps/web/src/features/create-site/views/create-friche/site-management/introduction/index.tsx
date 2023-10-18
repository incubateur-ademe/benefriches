import FricheManagementIntroduction from "./FricheManagementIntroduction";

import { goToNextStep } from "@/features/create-site/application/createFriche.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function FricheManagementIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <FricheManagementIntroduction onNext={() => dispatch(goToNextStep())} />
  );
}

export default FricheManagementIntroductionContainer;
