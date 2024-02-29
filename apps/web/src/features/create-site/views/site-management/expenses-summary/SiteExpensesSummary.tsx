import ExpensesBarChart from "./ExpensesBarChart";

import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  isFriche: boolean;
  ownerExpenses: Expense[];
  tenantExpenses: Expense[];
  onNext: () => void;
  onBack: () => void;
};

function SiteExpensesSummary({ onNext, onBack, isFriche, ownerExpenses, tenantExpenses }: Props) {
  const hasOwnerExpenses = ownerExpenses.length > 0;
  const hasTenantExpenses = tenantExpenses.length > 0;
  const hasNoExpenses = !hasOwnerExpenses && !hasTenantExpenses;

  return (
    <>
      <h2>Récapitulatif des coûts annuels liés {isFriche ? "à la friche" : "au site"}</h2>
      {hasNoExpenses && <p>Aucune dépense renseignée pour ce site.</p>}
      {hasOwnerExpenses && (
        <>
          <h3>À la charge du propriétaire</h3>
          <ExpensesBarChart expenses={ownerExpenses} />
        </>
      )}
      {hasTenantExpenses && (
        <>
          <h3>À la charge de l'exploitant</h3>
          <ExpensesBarChart expenses={tenantExpenses} />
        </>
      )}
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
}

export default SiteExpensesSummary;
