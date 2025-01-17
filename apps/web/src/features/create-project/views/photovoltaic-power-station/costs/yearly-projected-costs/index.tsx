import { RecurringExpense } from "shared";

import {
  completeYearlyProjectedExpenses,
  revertYearlyProjectedExpenses,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationYearlyExpensesInitialValues } from "@/features/create-project/core/renewable-energy/selectors/expenses.selectors";
import "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import YearlyProjectedExpensesForm from "../../../common-views/costs/yearly-projected-costs";

function YearlyProjectedExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectPhotovoltaicPowerStationYearlyExpensesInitialValues);

  return (
    <YearlyProjectedExpensesForm
      initialValues={initialValues}
      instructions={
        <FormInfo>
          <p>
            Les montants pré-remplis le sont d'après la puissance d'installation que vous avez
            renseigné (exprimée en kWc) et les dépenses moyennes observées.
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
      onSubmit={(expenses: RecurringExpense[]) => {
        dispatch(completeYearlyProjectedExpenses(expenses));
      }}
      onBack={() => {
        dispatch(revertYearlyProjectedExpenses());
      }}
    />
  );
}

export default YearlyProjectedExpensesFormContainer;
