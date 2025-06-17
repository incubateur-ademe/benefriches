import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { installationExpensesCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectDefaultInstallationCosts,
  selectInstallationCosts,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import InstallationExpensesForm, {
  FormValues,
} from "@/features/create-project/views/common-views/expenses/installation-expenses/InstallationExpensesForm";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import { mapFormValuesToExpenses, mapInitialValues } from "./mappers";

function InstallationExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const preEnteredValues = useAppSelector(selectInstallationCosts);
  const defaultValues = useAppSelector(selectDefaultInstallationCosts);

  const initialValues = mapInitialValues(preEnteredValues, defaultValues);

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
      initialValues={initialValues}
      onSubmit={(formData: FormValues) => {
        dispatch(installationExpensesCompleted(mapFormValuesToExpenses(formData)));
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default InstallationExpensesFormContainer;
