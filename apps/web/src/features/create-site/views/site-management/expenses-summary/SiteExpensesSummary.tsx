import ExpensesBarChart from "./ExpensesBarChart";

import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

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
    <WizardFormLayout
      title={`Récapitulatif des coûts annuels liés ${isFriche ? "à la friche" : "au site"}`}
    >
      {hasNoExpenses && <p>Aucune dépense renseignée pour ce site.</p>}
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {hasOwnerExpenses && (
          <div>
            <h3>À la charge du propriétaire</h3>
            <ExpensesBarChart expenses={ownerExpenses} />
          </div>
        )}
        {hasTenantExpenses && (
          <div>
            <h3>À la charge de l'exploitant</h3>
            <ExpensesBarChart expenses={tenantExpenses} />
          </div>
        )}
      </div>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
}

export default SiteExpensesSummary;
