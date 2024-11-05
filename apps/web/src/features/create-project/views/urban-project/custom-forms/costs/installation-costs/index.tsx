import { typedObjectEntries, UrbanProjectDevelopmentExpense } from "shared";

import {
  installationExpensesCompleted,
  installationExpensesReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { getDefaultInstallationCosts } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import InstallationExpensesForm, {
  FormValues,
} from "@/features/create-project/views/common-views/costs/installation-costs/InstallationCostsForm";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

const purposeMapKeys = {
  technicalStudyAmount: "technical_studies",
  worksAmount: "development_works",
  otherAmount: "other",
};

function InstallationExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector(getDefaultInstallationCosts);

  return (
    <InstallationExpensesForm
      title="Dépenses d’aménagement du site"
      instructions={
        <FormInfo>
          <p>
            Montants calculés d’après les informations que vous avez renseigné et les dépenses
            financiers moyens en France de chaque poste de dépense.
          </p>

          <p>Vous pouvez modifier ces montants.</p>
        </FormInfo>
      }
      defaultValues={
        defaultValues
          ? {
              works: defaultValues.developmentWorks,
              technicalStudy: defaultValues.technicalStudies,
              other: defaultValues.other,
            }
          : undefined
      }
      onSubmit={(formData: FormValues) => {
        const expenses = typedObjectEntries(formData)
          .filter(([, amount]) => amount && amount > 0)
          .map(
            ([purpose, amount]) =>
              ({
                amount: amount,
                purpose: purposeMapKeys[purpose],
              }) as UrbanProjectDevelopmentExpense,
          );
        dispatch(installationExpensesCompleted(expenses));
      }}
      onBack={() => {
        dispatch(installationExpensesReverted());
      }}
    />
  );
}

export default InstallationExpensesFormContainer;
