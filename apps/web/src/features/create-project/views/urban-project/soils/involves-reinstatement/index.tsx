import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import InvolvesReinstatementForm from "./InvolvesReinstatementForm";

export default function InvolvesReinstatementContainer() {
  const { onBack, selectStepAnswers, onRequestStepCompletion } = useProjectForm();

  const involvesReinstatement = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_INVOLVES_REINSTATEMENT"),
  )?.involvesReinstatement;

  return (
    <InvolvesReinstatementForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
          answers: {
            involvesReinstatement: formData.involvesReinstatement === "yes",
          },
        });
      }}
      onBack={onBack}
      initialValues={
        involvesReinstatement === undefined
          ? undefined
          : { involvesReinstatement: involvesReinstatement ? "yes" : "no" }
      }
    />
  );
}
