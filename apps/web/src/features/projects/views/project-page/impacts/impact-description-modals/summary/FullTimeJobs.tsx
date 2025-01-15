import { useContext } from "react";

import { formatNumberFr, formatPercentage } from "@/shared/services/format-number/formatNumber";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
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
    <>
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
      <ModalContent>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={difference}
            label="🧑‍🔧 Emplois équivalent temps plein"
            type="etp"
            onClick={() => {
              openImpactModalDescription({
                sectionName: "social",
                impactName: "full_time_jobs",
              });
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </>
  );
};

export default SummaryFullTimeJobsDescription;
