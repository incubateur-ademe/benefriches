import SiteManagementIntroduction from "./SiteManagementIntroduction";

import {
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SiteManagementIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SiteManagementIntroduction
      onNext={() => dispatch(goToStep(SiteCreationStep.OWNER))}
    />
  );
}

export default SiteManagementIntroductionContainer;
