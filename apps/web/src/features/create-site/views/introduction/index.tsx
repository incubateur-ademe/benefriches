import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import { introductionStepCompleted } from "../../core/steps/introduction/introduction.actions";
import SiteCreationIntroduction from "./SiteCreationIntroduction";

export default function SiteCreationIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <SiteCreationIntroduction onNext={() => dispatch(introductionStepCompleted())} />;
}
