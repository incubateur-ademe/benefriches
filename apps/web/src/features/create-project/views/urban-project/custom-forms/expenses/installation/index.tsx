import InstallationExpensesForm from "@/features/create-project/views/common-views/expenses/installation-expenses/InstallationExpensesForm";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import { mapExpensesToFormValues, mapFormValuesToExpenses } from "./mappers";

function InstallationExpensesFormContainer() {
  const { onBack, selectStepAnswers, onRequestStepCompletion } = useProjectForm();
  const installationExpenses = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_EXPENSES_INSTALLATION"),
  )?.installationExpenses;
  const initialValues = mapExpensesToFormValues(installationExpenses ?? []);

  return (
    <InstallationExpensesForm
      title="Dépenses d'aménagement du site"
      labels={{
        worksAmount: "Travaux d'aménagement",
        otherAmount: "Autres dépenses d'aménagement",
      }}
      instructions={
        <FormInfo>
          <p>
            Les montants sont exprimés en <strong>€ HT</strong>.
          </p>
          <p>
            Montants calculés d'après les informations que vous avez renseignées et les dépenses
            financiers moyens en France de chaque poste de dépense.
          </p>

          <p>Vous pouvez modifier ces montants.</p>
        </FormInfo>
      }
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
          answers: {
            installationExpenses: mapFormValuesToExpenses(formData),
          },
        });
      }}
      onBack={onBack}
      initialValues={initialValues}
    />
  );
}

export default InstallationExpensesFormContainer;
