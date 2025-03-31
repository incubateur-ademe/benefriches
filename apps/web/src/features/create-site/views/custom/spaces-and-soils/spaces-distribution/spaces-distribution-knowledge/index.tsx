import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { spacesSurfaceAreaDistributionKnowledgeCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSpacesDistributionKnowledgeForm, {
  type FormValues,
} from "./SiteSpacesDistributionKnowledgeForm";

function SiteSpacesDistributionKnowledgeFormContainer() {
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const dispatch = useAppDispatch();

  const onSubmit = ({ knowsSurfaceAreas }: FormValues) => {
    dispatch(
      spacesSurfaceAreaDistributionKnowledgeCompleted({
        knowsSurfaceAreas: knowsSurfaceAreas === "yes",
      }),
    );
  };

  const onBack = () => {
    dispatch(stepRevertAttempted());
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
