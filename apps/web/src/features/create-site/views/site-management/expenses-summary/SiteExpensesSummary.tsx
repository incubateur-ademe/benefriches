import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import ExpensesPieChart from "./ExpensesPieChart";

type Props = {
  expensesByBearer: { bearer: string; amount: number }[];
  expensesByCategory: { category: string; amount: number }[];
  onNext: () => void;
};

function SiteExpensesSummary({
  onNext,
  expensesByBearer,
  expensesByCategory,
}: Props) {
  return (
    <>
      <h2>Récapitulatif des coûts annuels du site</h2>
      <h3>Par acteurs</h3>
      <ExpensesPieChart
        expenses={expensesByBearer.map((expense) => ({
          amount: expense.amount,
          label: expense.bearer,
        }))}
      />
      <h3>Par type de dépenses</h3>
      <ExpensesPieChart
        expenses={expensesByCategory.map((expense) => ({
          amount: expense.amount,
          label: expense.category,
        }))}
      />
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
