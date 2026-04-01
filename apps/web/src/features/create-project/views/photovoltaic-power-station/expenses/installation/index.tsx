import { PhotovoltaicInstallationExpense, typedObjectEntries } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationInstallationExpensesInitialValues } from "@/features/create-project/core/renewable-energy/step-handlers/expenses/expenses-installation/expensesInstallation.selector";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
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
        <FormInfo>
          <p>
            Les montants sont exprimés en <strong>€ HT</strong>.
          </p>
          <p>
            Les montants pré-remplis le sont d'après la puissance d'installation que vous avez
            renseignées (exprimée en kWc) et les dépenses moyennes observées.
          </p>
          <p>
            <strong>Source&nbsp;: </strong>
            <br />
            <ExternalLink href="https://www.cre.fr/documents/Publications/Rapports-thematiques/Couts-et-rentabilites-du-grand-photovoltaique-en-metropole-continentale">
              Commission de régulation de l'énergie
            </ExternalLink>
          </p>
          <p>Vous pouvez modifier ces montants.</p>
        </FormInfo>
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
