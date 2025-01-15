import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import classNames from "@/shared/views/clsx";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    isSuccess: boolean;
    value: {
      economicBalanceTotal: number;
      socioEconomicMonetaryImpactsTotal: number;
    };
  };
};

const SummaryProjectBalanceDescription = ({ impactData }: Props) => {
  const { value, isSuccess } = impactData;

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const { socioEconomicMonetaryImpactsTotal, economicBalanceTotal } = value;

  const title = isSuccess
    ? "Les impacts compensent le déficit de l'opération\u00a0💰"
    : "Les impacts ne compensent pas le déficit de l'opération\u00a0💸";

  return (
    <>
      <ModalHeader
        title={title}
        subtitle={
          <>
            <span
              className={classNames(
                "tw-font-bold",
                socioEconomicMonetaryImpactsTotal > 0 &&
                  "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light",
                socioEconomicMonetaryImpactsTotal < 0 &&
                  "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
              )}
            >
              {formatMonetaryImpact(socioEconomicMonetaryImpactsTotal)}
            </span>{" "}
            d'impacts socio-économiques contre{" "}
            <span
              className={classNames(
                "tw-font-bold",
                economicBalanceTotal > 0 &&
                  "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light",
                economicBalanceTotal < 0 &&
                  "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
              )}
            >
              {formatMonetaryImpact(economicBalanceTotal)}
            </span>{" "}
            de bilan d’opération
          </>
        }
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={economicBalanceTotal}
            label="📉 Bilan de l'opération"
            type="monetary"
            onClick={() => {
              openImpactModalDescription({
                sectionName: "economic_balance",
              });
            }}
          />
        </ImpactItemGroup>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={socioEconomicMonetaryImpactsTotal}
            label="🌍 Impacts socio-économiques"
            type="monetary"
            onClick={() => {
              openImpactModalDescription({
                sectionName: "socio_economic",
              });
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </>
  );
};

export default SummaryProjectBalanceDescription;
