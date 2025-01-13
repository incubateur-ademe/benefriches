import { useContext } from "react";

import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

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
        openImpactModalDescription({ sectionName: "economic_balance" });
      }}
    >
      {economicBalance.map(({ name, value, details = [] }) => (
        <ImpactActorsItem
          key={name}
          label={getEconomicBalanceImpactLabel(name)}
          onClick={() => {
            openImpactModalDescription({ sectionName: "economic_balance", impactName: name });
          }}
          actors={[
            {
              label: bearer ?? "Aménageur",
              value,
              details: details.map(({ name: detailsName, value: detailsValue }) => ({
                label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                value: detailsValue,
                onClick: () => {
                  openImpactModalDescription({
                    sectionName: "economic_balance",
                    impactName: name,
                    impactDetailsName: detailsName,
                  });
                },
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
