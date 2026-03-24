import { useAppDispatch } from "@/app/hooks/store.hooks";
import { nextStepRequested } from "@/features/create-site/core/demo/demoFactory";

import DemoSiteIntroduction from "./DemoSiteIntroduction";

export default function DemoSiteIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <DemoSiteIntroduction onNext={() => dispatch(nextStepRequested())} />;
}
