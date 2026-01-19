import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import SiteResaleForm from "./SiteResaleForm";

export default function SiteResaleFormContainer() {
  const { onBack, selectStepAnswers, onRequestStepCompletion } = useProjectForm();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_SITE_RESALE_SELECTION"));

  return (
    <SiteResaleForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
          answers: {
            siteResaleSelection: formData.siteResalePlanned as "yes" | "no" | "unknown",
          },
        });
      }}
      onBack={onBack}
      initialValues={
        stepAnswers?.siteResaleSelection
          ? { siteResalePlanned: stepAnswers.siteResaleSelection }
          : undefined
      }
    />
  );
}
