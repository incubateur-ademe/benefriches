import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import { SpacesKnowledgeForm } from "./SpacesKnowledgeForm";

export default function SpacesKnowledgeFormContainer() {
  const { onBack, onRequestStepCompletion, selectSiteNature } = useCustomSiteForm();
  const siteNature = useAppSelector(selectSiteNature);

  return (
    <SpacesKnowledgeForm
      onSubmit={(data) => {
        onRequestStepCompletion({
          stepId: "SPACES_KNOWLEDGE",
          answers: { knowsSpaces: data.knowsSpaces === "yes" },
        });
      }}
      onBack={() => {
        onBack();
      }}
      siteNature={siteNature}
    />
  );
}
