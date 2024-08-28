import { introductionStepCompleted } from "../../application/createSite.reducer";
import SiteCreationIntroduction from "./SiteCreationIntroduction";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

export default function SiteCreationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <SiteCreationIntroduction onNext={() => dispatch(introductionStepCompleted())} />;
}
