import ExpensesBarChart from "./ExpensesBarChart";

import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  isFriche: boolean;
  ownerExpenses: Expense[];
  tenantExpenses: Expense[];
  ownerName?: string;
  tenantName?: string;
  onNext: () => void;
  onBack: () => void;
};

function SiteExpensesSummary({
  onNext,
  onBack,
  isFriche,
  ownerExpenses,
  tenantExpenses,
  tenantName,
  ownerName,
}: Props) {
  const hasOwnerExpenses = ownerExpenses.length > 0;
  const hasTenantExpenses = tenantExpenses.length > 0;
  const hasNoExpenses = !hasOwnerExpenses && !hasTenantExpenses;

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
            tenantExpenses={tenantExpenses}
            ownerName={ownerName}
            tenantName={tenantName}
          />
        </div>
      )}

      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
}

export default SiteExpensesSummary;
