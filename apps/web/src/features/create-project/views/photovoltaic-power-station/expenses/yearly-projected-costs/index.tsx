import { RecurringExpense } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationYearlyExpensesInitialValues } from "@/features/create-project/core/renewable-energy/step-handlers/expenses/expenses-yearly-projected/expensesYearlyProjected.selector";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import YearlyProjectedExpensesForm from "@/shared/views/project-form/common/expenses/yearly-projected-expenses";

function YearlyProjectedExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectPhotovoltaicPowerStationYearlyExpensesInitialValues);

  return (
    <YearlyProjectedExpensesForm
      initialValues={initialValues}
      instructions={
        <FormInfo emoji="auto">
          <span className="title">D’où viennent les montants préremplis ?</span>
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
        </FormInfo>
      }
      onSubmit={(expenses: RecurringExpense[]) => {
        dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
            answers: { yearlyProjectedExpenses: expenses },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default YearlyProjectedExpensesFormContainer;
