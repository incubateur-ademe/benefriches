import { sumListWithKey } from "shared";

import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { getEconomicBalanceImpactColor } from "../../../getImpactColor";
import ImpactModalDescription, {
  ModalDataProps,
} from "../../../impact-description-modals/ImpactModalDescription";
import ImpactColumnChartCard from "../../ImpactChartCard/ImpactColumnChartCard";

type Props = {
  economicBalance: EconomicBalance["economicBalance"];
  bearer?: string;
  modalData: ModalDataProps;
};

const DIALOG_ID = "fr-modal-impacts_economic_balance-Chart";

function EconomicBalanceChartCard({ economicBalance, bearer = "l'aménageur", modalData }: Props) {
  const revenuesList = economicBalance.filter(({ value }) => value > 0);
  const costsList = economicBalance.filter(({ value }) => value < 0);

  const maxRevenue = revenuesList.toSorted((a, b) => b.value - a.value)[0]?.name;
  const maxCost = costsList.toSorted((a, b) => Math.abs(b.value) - Math.abs(a.value))[0]?.name;

  return (
    <>
      <ImpactModalDescription
        dialogId={DIALOG_ID}
        {...modalData}
        initialState={{ sectionName: "economic_balance" }}
      />
      <ImpactColumnChartCard
        title="Bilan de l'opération"
        subtitle={`Pour ${bearer}`}
        dialogId={DIALOG_ID}
        formatFn={formatMonetaryImpact}
        data={[
          {
            label: "Recettes",
            color: maxRevenue ? getEconomicBalanceImpactColor(maxRevenue) : undefined,
            value: sumListWithKey(revenuesList, "value"),
          },
          {
            label: "Dépenses",
            color: maxCost ? getEconomicBalanceImpactColor(maxCost) : undefined,
            value: sumListWithKey(costsList, "value"),
          },
        ]}
      />
    </>
  );
}

export default EconomicBalanceChartCard;
