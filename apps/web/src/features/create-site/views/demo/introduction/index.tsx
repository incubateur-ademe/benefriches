import { useDemoSiteForm } from "@/features/create-site/views/site-form/useDemoSiteForm";

import DemoSiteIntroduction from "./DemoSiteIntroduction";

export default function DemoSiteIntroductionContainer() {
  const { onNext } = useDemoSiteForm();

  return <DemoSiteIntroduction onNext={onNext} />;
}
