import { useContext } from "react";

import {
  EconomicBalance,
  EconomicBalanceName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactDescriptionModalWizard";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

const itemDescriptionModalIds: Partial<
  Record<EconomicBalanceName, ImpactDescriptionModalCategory>
> = {
  site_purchase: "economic-balance.real-estate-acquisition",
  site_reinstatement: "economic-balance.site-reinstatement",
};

type Props = {
  impact: EconomicBalance;
};

const EconomicBalanceListSection = ({ impact }: Props) => {
  const { total, economicBalance, bearer } = impact;

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactSection
      title="Bilan de l'opération"
      isMain
      total={total}
      initialShowSectionContent={false}
      onTitleClick={() => {
        openImpactModalDescription("economic-balance");
      }}
    >
      {economicBalance.map(({ name, value, details = [] }) => (
        <ImpactActorsItem
          key={name}
          label={getEconomicBalanceImpactLabel(name)}
          descriptionModalId={itemDescriptionModalIds[name]}
          actors={[
            {
              label: bearer ?? "Aménageur",
              value,
              details: details.map(({ name: detailsName, value: detailsValue }) => ({
                label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                value: detailsValue,
                descriptionModalId: itemDescriptionModalIds[detailsName],
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
