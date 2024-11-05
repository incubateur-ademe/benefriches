import { PhotovoltaicInstallationExpense, typedObjectEntries } from "shared";

import {
  completePhotovoltaicPanelsInstallationExpenses,
  revertPhotovoltaicPanelsInstallationExpenses,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { getDefaultValuesForPhotovoltaicInstallationExpenses } from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import InstallationExpensesForm, {
  FormValues,
} from "../../../common-views/costs/installation-costs/InstallationCostsForm";

const purposeMapKeys = {
  technicalStudyAmount: "technical_studies",
  worksAmount: "installation_works",
  otherAmount: "other",
};

function PhotovoltaicPanelsInstallationExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector(getDefaultValuesForPhotovoltaicInstallationExpenses);

  return (
    <InstallationExpensesForm
      title="Dépenses d'installation de la centrale photovoltaïque"
      instructions={
        <FormInfo>
          <p>
            Les montants pré-remplis le sont d'après la puissance d'installation que vous avez
            renseignée (exprimée en kWc) et les dépenses moyennes observées.
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
      defaultValues={defaultValues}
      onSubmit={(formData: FormValues) => {
        const expenses = typedObjectEntries(formData)
          .filter(([, amount]) => amount && amount > 0)
          .map(
            ([purpose, amount]) =>
              ({
                amount: amount,
                purpose: purposeMapKeys[purpose],
              }) as PhotovoltaicInstallationExpense,
          );
        dispatch(completePhotovoltaicPanelsInstallationExpenses(expenses));
      }}
      onBack={() => {
        dispatch(revertPhotovoltaicPanelsInstallationExpenses());
      }}
    />
  );
}

export default PhotovoltaicPanelsInstallationExpensesFormContainer;
