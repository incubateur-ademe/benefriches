import { SiteYearlyExpense, SiteYearlyIncome } from "shared";

import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

import ExpensesIncomeBarChart from "./ExpensesIncomeBarChart";

type Props = {
  isFriche: boolean;
  ownerExpenses: SiteYearlyExpense[];
  tenantExpenses: SiteYearlyExpense[];
  ownerIncome: SiteYearlyIncome[];
  tenantIncome: SiteYearlyIncome[];
  ownerName?: string;
  tenantName?: string;
  onNext: () => void;
  onBack: () => void;
};

function SiteExpensesIncomeSummary({
  onNext,
  onBack,
  isFriche,
  ownerExpenses,
  tenantExpenses,
  ownerIncome,
  tenantIncome,
  tenantName,
  ownerName,
}: Props) {
  const hasExpensesOrIncome =
    [...ownerExpenses, ...tenantExpenses, ...ownerIncome, ...tenantIncome].length > 0;

  const tenantLabel = isFriche ? "Locataire" : "Exploitant";

  const title = isFriche
    ? "Récapitulatif des dépenses annuelles liées à la friche"
    : "Récapitulatif des dépenses et recettes liées à l'exploitation";

  return (
    <>
      <h2>{title}</h2>

      {!hasExpensesOrIncome ? (
        <p>Aucune dépense ni recette renseignée pour ce site.</p>
      ) : (
        <div
          className={classNames(
            "tw-flex",
            "tw-justify-around",
            "tw-border",
            "tw-border-solid",
            "tw-border-borderGrey",
            "tw-my-8",
            "tw-p-4",
            "tw-pt-6",
          )}
        >
          <ExpensesIncomeBarChart
            ownerExpenses={ownerExpenses}
            tenantExpenses={tenantExpenses}
            ownerIncome={ownerIncome}
            tenantIncome={tenantIncome}
            ownerName={ownerName ? `${ownerName} (propriétaire)` : "Propriétaire"}
            tenantName={tenantName ? `${tenantName} (${tenantLabel.toLowerCase()})` : tenantLabel}
          />
        </div>
      )}

      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
}

export default SiteExpensesIncomeSummary;
