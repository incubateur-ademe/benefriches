import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { spacesSurfaceAreaDistributionKnowledgeCompleted } from "@/features/create-site/core/steps/spaces/spaces.actions";
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
    dispatch(stepReverted());
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
