import { requestStepCompletion } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import InstallationExpensesForm from "@/features/create-project/views/common-views/expenses/installation-expenses/InstallationExpensesForm";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import { useStepBack } from "../../useStepBack";
import { mapExpensesToFormValues, mapFormValuesToExpenses } from "./mappers";

function InstallationExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_EXPENSES_INSTALLATION"));

  const initialValues = mapExpensesToFormValues(stepAnswers?.installationExpenses ?? []);
  const onBack = useStepBack();

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
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
            answers: {
              installationExpenses: mapFormValuesToExpenses(formData),
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={initialValues}
    />
  );
}

export default InstallationExpensesFormContainer;
