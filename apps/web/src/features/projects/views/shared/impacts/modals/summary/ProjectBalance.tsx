import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import classNames from "@/shared/views/clsx";

import ImpactItemDetails from "../../../../project-page/impacts/list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../../project-page/impacts/list-view/ImpactItemGroup";

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

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const { socioEconomicMonetaryImpactsTotal, economicBalanceTotal } = value;

  const title = isSuccess
    ? "Les impacts compensent le déficit de l'opération\u00a0💰"
    : "Les impacts ne compensent pas le déficit de l'opération\u00a0💸";

  return (
    <ModalBody>
      <ModalHeader
        title={title}
        subtitle={
          <>
            <span
              className={classNames(
                "tw-font-bold",
                getPositiveNegativeTextClassesFromValue(socioEconomicMonetaryImpactsTotal),
              )}
            >
              {formatMonetaryImpact(socioEconomicMonetaryImpactsTotal)}
            </span>{" "}
            d'impacts socio-économiques contre{" "}
            <span
              className={classNames(
                "tw-font-bold",
                getPositiveNegativeTextClassesFromValue(economicBalanceTotal),
              )}
            >
              {formatMonetaryImpact(economicBalanceTotal)}
            </span>{" "}
            de bilan d’opération
          </>
        }
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent noTitle>
        <p>
          {isSuccess
            ? "Pour ce projet, la valeur monétaire de tous les impacts socio-économiques et environnementaux est plus élevée que la valeur absolue du déficit d’opération."
            : "Pour ce projet, la valeur monétaire de tous les impacts socio-économiques et environnementaux est plus faible que la valeur absolue du déficit d’opération. La valeur générée par le projet à moyen / long terme reste inférieure au déficit économique de court terme."}
        </p>
        <p>
          Retrouver les valeurs associées à ces indicateurs et à leurs modalités de calcul via les
          liens ci-dessous.
        </p>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={economicBalanceTotal}
            label="📉 Bilan de l'opération"
            type="monetary"
            labelProps={{
              onClick: (e) => {
                e.stopPropagation();
                updateModalContent({
                  sectionName: "economic_balance",
                });
              },
            }}
          />
        </ImpactItemGroup>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={socioEconomicMonetaryImpactsTotal}
            label="🌍 Impacts socio-économiques"
            type="monetary"
            labelProps={{
              onClick: (e) => {
                e.stopPropagation();
                updateModalContent({
                  sectionName: "socio_economic",
                });
              },
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryProjectBalanceDescription;
