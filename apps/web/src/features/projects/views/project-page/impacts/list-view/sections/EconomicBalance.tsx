import React from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { EconomicBalanceByCategory } from "@/features/projects/core/projectImpactsEconomicBalance";

import { getEconomicBalanceImpactLabel } from "../../getImpactLabel";
import ImpactModalDescription from "../../impact-description-modals/ImpactModalDescription";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";
import { getDialogControlButtonProps } from "../dialogControlBtnProps";

type Props = {
  impact: EconomicBalanceByCategory;
  modalData: ModalDataProps;
};

const EconomicBalanceListSection = ({ impact, modalData }: Props) => {
  const { total, economicBalance, bearerName } = impact;

  return (
    <>
      <ImpactModalDescription
        dialogId={`fr-modal-impacts-economic_balance-List`}
        initialState={{ sectionName: "economic_balance" }}
        {...modalData}
      />
      <ImpactSection
        title="Bilan de l'opération"
        isMain
        total={total}
        initialShowSectionContent={false}
        dialogId={`fr-modal-impacts-economic_balance-List`}
      >
        {economicBalance?.map(({ keyName, details, total }) => (
          <React.Fragment key={keyName}>
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-economic_balance-${keyName}-List`}
              initialState={{ sectionName: "economic_balance", impactName: keyName }}
              {...modalData}
            />

            <ImpactActorsItem
              key={keyName}
              label={getEconomicBalanceImpactLabel(keyName)}
              labelProps={getDialogControlButtonProps(
                `fr-modal-impacts-economic_balance-${keyName}-List`,
              )}
              actors={[
                {
                  label: bearerName ?? "Aménageur",
                  value: total,
                  details: details.map((d) => ({
                    label: getEconomicBalanceImpactLabel(d.keyName),
                    value: d.total,
                    labelProps: getDialogControlButtonProps(
                      `fr-modal-impacts-economic_balance-${keyName}-${d.name}-List`,
                    ),
                  })),
                },
              ]}
              type="monetary"
            />
            {details.map(({ name: detailsName, keyName: detailsKeyName }) => (
              <ImpactModalDescription
                key={detailsName}
                dialogId={`fr-modal-impacts-economic_balance-${keyName}-${detailsName}-List`}
                initialState={{
                  sectionName: "economic_balance",
                  impactName: keyName,
                  impactDetailsName: detailsKeyName,
                }}
                {...modalData}
              />
            ))}
          </React.Fragment>
        ))}
      </ImpactSection>
    </>
  );
};

export default EconomicBalanceListSection;
