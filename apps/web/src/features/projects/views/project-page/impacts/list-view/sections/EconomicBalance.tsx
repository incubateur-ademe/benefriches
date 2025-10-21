import React from "react";

import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import ImpactModalDescription, {
  ModalDataProps,
} from "../../impact-description-modals/ImpactModalDescription";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";
import { getDialogControlButtonProps } from "../dialogControlBtnProps";

type Props = {
  impact: EconomicBalance;
  modalData: ModalDataProps;
};

const EconomicBalanceListSection = ({ impact, modalData }: Props) => {
  const { total, economicBalance, bearer } = impact;

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
        {economicBalance.map(({ name, value, details = [] }) => (
          <React.Fragment key={name}>
            <ImpactModalDescription
              dialogId={`fr-modal-impacts-economic_balance-${name}-List`}
              initialState={{ sectionName: "economic_balance", impactName: name }}
              {...modalData}
            />

            <ImpactActorsItem
              key={name}
              label={getEconomicBalanceImpactLabel(name)}
              labelProps={getDialogControlButtonProps(
                `fr-modal-impacts-economic_balance-${name}-List`,
              )}
              actors={[
                {
                  label: bearer ?? "Aménageur",
                  value,
                  details: details.map(({ name: detailsName, value: detailsValue }) => ({
                    label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                    value: detailsValue,
                    labelProps: getDialogControlButtonProps(
                      `fr-modal-impacts-economic_balance-${name}-${detailsName}-List`,
                    ),
                  })),
                },
              ]}
              type="monetary"
            />
            {details.map(({ name: detailsName }) => (
              <ImpactModalDescription
                key={detailsName}
                dialogId={`fr-modal-impacts-economic_balance-${name}-${detailsName}-List`}
                initialState={{
                  sectionName: "economic_balance",
                  impactName: name,
                  impactDetailsName: detailsName,
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
