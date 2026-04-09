import { useAppSelector } from "@/app/hooks/store.hooks";
import FormAutoInfo from "@/shared/views/layout/WizardFormLayout/FormAutoInfo";
import InstallationExpensesForm from "@/shared/views/project-form/common/expenses/installation-expenses/InstallationExpensesForm";
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
        <FormAutoInfo>
          D’où viennent les montants préremplis ?
          <p>
            Montants calculés d’après les informations que vous avez renseigné et les montants
            représentatifs en France pour ce type de dépense.
          </p>
        </FormAutoInfo>
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
