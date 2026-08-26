import React, { useContext } from "react";

import { EconomicBalanceByCategory } from "@/features/projects/core/projectImpactsEconomicBalance";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { getEconomicBalanceImpactLabel } from "../../getImpactLabel";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

type Props = {
  impact: EconomicBalanceByCategory;
};

const EconomicBalanceListSection = ({ impact }: Props) => {
  const { total, economicBalance, bearerName } = impact;

  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactSection
      title="Bilan de l'opération"
      isMain
      total={total}
      initialShowSectionContent={false}
      labelProps={getDetailsLink({
        sectionName: "economicBalance",
      })}
    >
      {economicBalance?.map(({ keyName, details, total }) => (
        <React.Fragment key={keyName}>
          <ImpactActorsItem
            key={keyName}
            label={getEconomicBalanceImpactLabel(keyName)}
            labelProps={getDetailsLink({
              sectionName: "economicBalance",
              impactDetailsName: keyName,
            })}
            actors={[
              {
                label: bearerName ?? "Aménageur",
                value: total,
                details: details.map((d) => ({
                  label: getEconomicBalanceImpactLabel(d.keyName),
                  value: d.total,
                  labelProps: getDetailsLink({
                    sectionName: "economicBalance",
                    impactDetailsName: d.keyName,
                  }),
                })),
              },
            ]}
            type="monetary"
          />
        </React.Fragment>
      ))}
    </ImpactSection>
  );
};

export default EconomicBalanceListSection;
