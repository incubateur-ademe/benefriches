import ExpensesBarChart from "./ExpensesBarChart";

import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  isFriche: boolean;
  ownerExpenses: Expense[];
  operatorExpenses: Expense[];
  ownerName?: string;
  operatorName?: string;
  onNext: () => void;
  onBack: () => void;
};

function SiteExpensesSummary({
  onNext,
  onBack,
  isFriche,
  ownerExpenses,
  operatorExpenses,
  operatorName,
  ownerName,
}: Props) {
  const hasOwnerExpenses = ownerExpenses.length > 0;
  const hasOperatorExpenses = operatorExpenses.length > 0;
  const hasNoExpenses = !hasOwnerExpenses && !hasOperatorExpenses;

  return (
    <>
      <h2>Récapitulatif des coûts annuels liés {isFriche ? "à la friche" : "au site"}</h2>

      {hasNoExpenses ? (
        <p>Aucune dépense renseignée pour ce site.</p>
      ) : (
        <div
          className={classNames(
            "tw-flex",
            "tw-justify-around",
            "tw-border",
            "tw-border-solid",
            "tw-border-grey",
            "tw-my-8",
            "tw-p-4",
            "tw-pt-6",
          )}
        >
          <ExpensesBarChart
            ownerExpenses={ownerExpenses}
            operatorExpenses={operatorExpenses}
            ownerName={ownerName}
            operatorName={operatorName}
          />
        </div>
      )}

      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
}

export default SiteExpensesSummary;
