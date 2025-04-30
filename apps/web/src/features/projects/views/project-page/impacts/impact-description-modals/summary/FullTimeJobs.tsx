import { useContext } from "react";

import { formatNumberFr, formatPercentage } from "@/shared/core/format-number/formatNumber";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    isSuccess: boolean;
    value: {
      percentageEvolution: number;
      difference: number;
    };
  };
};

const SummaryFullTimeJobsDescription = ({ impactData }: Props) => {
  const { isSuccess, value } = impactData;
  const { difference, percentageEvolution } = value;

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const title = isSuccess ? `+ d’emplois\u00a0👷` : `- d’emplois\u00a0👷`;

  return (
    <ModalBody>
      <ModalHeader
        title={title}
        value={{
          text: formatNumberFr(difference),
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `emploi équivalent temps plein créé ou maintenu (soit ${formatPercentage(percentageEvolution)})`
            : `emploi équivalent temps plein perdu (soit ${formatPercentage(percentageEvolution)})`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent noTitle>
        <p>
          La concrétisation du projet nécessite généralement une activité économique qui va
          impliquer des emplois, au minimum de manière transitoire pour la remise en état du site
          (déconstruction, dépollution, etc.) et pour les étapes d’aménagement et/ou de
          construction.
        </p>
        <p>
          Ensuite, en cas de finalité économique du projet (ex : services de proximité, bureaux,
          réindustrialisation), des emplois pourront être pérennisés (ex: déménagement d’entreprise)
          ou crées.
        </p>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={difference}
            label="🧑‍🔧 Emplois équivalent temps plein"
            type="etp"
            labelProps={{
              onClick: (e) => {
                e.stopPropagation();
                openImpactModalDescription({
                  sectionName: "social",
                  impactName: "full_time_jobs",
                });
              },
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryFullTimeJobsDescription;
