import type { SiteYearlyExpense, SiteYearlyIncome } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  expenses: SiteYearlyExpense[];
  incomes: SiteYearlyIncome[];
  onNext: () => void;
  onBack: () => void;
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);

const UrbanZoneExpensesAndIncomeSummary = ({ expenses, incomes, onNext, onBack }: Props) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
  const hasData = expenses.length > 0 || incomes.length > 0;

  return (
    <>
      <h2>Récapitulatif des dépenses et recettes annuelles liées à la zone commerciale</h2>

      {!hasData ? (
        <p>Aucune dépense ni recette renseignée pour ce site.</p>
      ) : (
        <div className="my-8">
          {expenses.length > 0 && (
            <div className="mb-6">
              <h3>Dépenses annuelles</h3>
              <p className="text-xl font-bold">{formatAmount(totalExpenses)} / an</p>
            </div>
          )}
          {incomes.length > 0 && (
            <div>
              <h3>Recettes annuelles</h3>
              <p className="text-xl font-bold">{formatAmount(totalIncomes)} / an</p>
            </div>
          )}
        </div>
      )}

      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default UrbanZoneExpensesAndIncomeSummary;
