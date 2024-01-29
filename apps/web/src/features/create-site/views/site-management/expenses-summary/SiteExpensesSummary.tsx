import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import ExpensesBarChart from "./ExpensesBarChart";

import { Expense } from "@/features/create-site/domain/siteFoncier.types";

type Props = {
  isFriche: boolean;
  ownerExpenses: Expense[];
  tenantExpenses: Expense[];
  onNext: () => void;
};

function SiteExpensesSummary({ onNext, isFriche, ownerExpenses, tenantExpenses }: Props) {
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
      <ButtonsGroup
        buttonsEquisized
        inlineLayoutWhen="always"
        buttons={[
          {
            children: "Suivant",
            nativeButtonProps: { type: "submit" },
            onClick: onNext,
          },
        ]}
      />
    </>
  );
}

export default SiteExpensesSummary;
