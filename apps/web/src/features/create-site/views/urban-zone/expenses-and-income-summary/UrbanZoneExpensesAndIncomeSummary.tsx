import type { SiteYearlyExpense, SiteYearlyIncome } from "shared";

import ExpensesIncomeBarChart from "@/features/create-site/views/common-views/site-management/expenses-and-income/expenses-income-summary/ExpensesIncomeBarChart";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  ownerExpenses: SiteYearlyExpense[];
  ownerIncome: SiteYearlyIncome[];
  onNext: () => void;
  onBack: () => void;
};

const UrbanZoneExpensesAndIncomeSummary = ({
  ownerExpenses,
  ownerIncome,
  onNext,
  onBack,
}: Props) => {
  const hasData = ownerExpenses.length > 0 || ownerIncome.length > 0;

  return (
    <>
      <h2>Récapitulatif des dépenses et recettes annuelles liées à la zone commerciale</h2>

      {!hasData ? (
        <p>Aucune dépense ni recette renseignée pour ce site.</p>
      ) : (
        <div className="my-8 flex justify-around border border-solid border-border-grey p-4 pt-6">
          <ExpensesIncomeBarChart
            ownerExpenses={ownerExpenses}
            tenantExpenses={[]}
            ownerIncome={ownerIncome}
            tenantIncome={[]}
            ownerName="Gestionnaire de parc d'activité"
            tenantName=""
            showTenant={false}
          />
        </div>
      )}

      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default UrbanZoneExpensesAndIncomeSummary;
