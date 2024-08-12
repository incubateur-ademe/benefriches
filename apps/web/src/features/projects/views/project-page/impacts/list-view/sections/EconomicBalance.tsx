import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

import {
  EconomicBalance,
  EconomicBalanceName,
} from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactDescriptionModalWizard";

const getImpactItemOnClick = (
  itemName: EconomicBalanceName,
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
) => {
  switch (itemName) {
    case "site_purchase":
      return () => {
        openImpactDescriptionModal("economic-balance.real-estate-acquisition");
      };
    case "site_reinstatement":
      return () => {
        openImpactDescriptionModal("economic-balance.site-reinstatement");
      };
    default:
      return undefined;
  }
};

type Props = {
  impact: EconomicBalance;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const EconomicBalanceListSection = ({ impact, openImpactDescriptionModal }: Props) => {
  const { total, economicBalance, bearer } = impact;
  return (
    <ImpactSection
      title="Bilan de l'opération"
      isMain
      total={total}
      onClick={() => {
        openImpactDescriptionModal("economic-balance");
      }}
    >
      {economicBalance.map(({ name, value, details = [] }) => (
        <ImpactActorsItem
          key={name}
          label={getEconomicBalanceImpactLabel(name)}
          onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
          actors={[
            {
              label: bearer ?? "Aménageur",
              value,
              details: details.map(({ name: detailsName, value: detailsValue }) => ({
                label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                value: detailsValue,
                onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
              })),
            },
          ]}
          type="monetary"
        />
      ))}
    </ImpactSection>
  );
};

export default EconomicBalanceListSection;
