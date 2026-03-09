import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import { HTML_MAIN_TITLE } from "../SiteCreationWizard";

// Step views will be added here as phases 3+ are implemented
function SiteCreationUrbanZoneStepContent() {
  return <HtmlTitle>{`Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>;
}

export default SiteCreationUrbanZoneStepContent;
