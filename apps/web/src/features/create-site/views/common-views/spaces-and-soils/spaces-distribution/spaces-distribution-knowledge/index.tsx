import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSiteNature } from "@/features/create-site/core/selectors/createSite.selectors";

import SiteSpacesDistributionKnowledgeForm, {
  type FormValues,
} from "./SiteSpacesDistributionKnowledgeForm";

function SiteSpacesDistributionKnowledgeFormContainer() {
  const siteNature = useAppSelector(selectSiteNature);
  const dispatch = useAppDispatch();

  const onSubmit = ({ knowsSurfaceAreas }: FormValues) => {
    dispatch(
      stepCompletionRequested({
        stepId: "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
        answers: { knowsSurfaceAreas: knowsSurfaceAreas === "yes" },
      }),
    );
  };

  const onBack = () => {
    dispatch(previousStepRequested());
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
