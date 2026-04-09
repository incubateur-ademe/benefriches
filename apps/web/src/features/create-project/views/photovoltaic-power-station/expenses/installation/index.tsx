import { PhotovoltaicInstallationExpense, typedObjectEntries } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationInstallationExpensesInitialValues } from "@/features/create-project/core/renewable-energy/step-handlers/expenses/expenses-installation/expensesInstallation.selector";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormAutoInfo from "@/shared/views/layout/WizardFormLayout/FormAutoInfo";
import InstallationExpensesForm, {
  FormValues,
} from "@/shared/views/project-form/common/expenses/installation-expenses/InstallationExpensesForm";

const purposeMapKeys = {
  technicalStudyAmount: "technical_studies",
  worksAmount: "installation_works",
  otherAmount: "other",
} as const satisfies Record<keyof FormValues, PhotovoltaicInstallationExpense["purpose"]>;

function PhotovoltaicPanelsInstallationExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(
    selectPhotovoltaicPowerStationInstallationExpensesInitialValues,
  );

  return (
    <InstallationExpensesForm
      title="Dépenses d'installation de la centrale photovoltaïque"
      instructions={
        <FormAutoInfo>
          D’où viennent les montants préremplis ?
          <p>
            Montants calculés d’après les informations que vous avez renseigné et les dépenses
            financiers moyens en France de chaque poste de dépense.
          </p>
          <p>
            <strong>Source&nbsp;: </strong>
            <br />
            <ExternalLink href="https://www.cre.fr/documents/Publications/Rapports-thematiques/Couts-et-rentabilites-du-grand-photovoltaique-en-metropole-continentale">
              Commission de régulation de l'énergie
            </ExternalLink>
          </p>
        </FormAutoInfo>
      }
      initialValues={{
        worksAmount: initialValues.works,
        technicalStudyAmount: initialValues.technicalStudy,
        otherAmount: initialValues.other,
      }}
      onSubmit={(formData: FormValues) => {
        const expenses: PhotovoltaicInstallationExpense[] = typedObjectEntries(formData)
          .filter(([, amount]) => amount && amount > 0)
          .map(([purpose, amount]) => ({
            amount: amount as number,
            purpose: purposeMapKeys[purpose],
          }));
        dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
            answers: { photovoltaicPanelsInstallationExpenses: expenses },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default PhotovoltaicPanelsInstallationExpensesFormContainer;
