import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteSpacesDistributionKnowledgeForm, {
  type FormValues,
} from "./SiteSpacesDistributionKnowledgeForm";

function SiteSpacesDistributionKnowledgeFormContainer() {
  const { onBack, onRequestStepCompletion, selectSiteNature } = useCustomSiteForm();
  const siteNature = useAppSelector(selectSiteNature);

  const onSubmit = ({ knowsSurfaceAreas }: FormValues) => {
    onRequestStepCompletion({
      stepId: "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
      answers: { knowsSurfaceAreas: knowsSurfaceAreas === "yes" },
    });
  };

  return (
    <SiteSpacesDistributionKnowledgeForm
      onSubmit={onSubmit}
      onBack={onBack}
      siteNature={siteNature}
    />
  );
}

export default SiteSpacesDistributionKnowledgeFormContainer;
