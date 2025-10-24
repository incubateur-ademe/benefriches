import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import SiteResaleForm from "./SiteResaleForm";

export default function SiteResaleFormContainer() {
  const { onBack, selectStepAnswers, onRequestStepCompletion } = useProjectForm();
  const siteResalePlannedAfterDevelopment = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SITE_RESALE_SELECTION"),
  )?.siteResalePlannedAfterDevelopment;

  return (
    <SiteResaleForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
          answers: {
            siteResalePlannedAfterDevelopment: formData.siteResalePlanned === "yes",
          },
        });
      }}
      onBack={onBack}
      initialValues={
        siteResalePlannedAfterDevelopment === undefined
          ? undefined
          : { siteResalePlanned: siteResalePlannedAfterDevelopment ? "yes" : "no" }
      }
    />
  );
}
