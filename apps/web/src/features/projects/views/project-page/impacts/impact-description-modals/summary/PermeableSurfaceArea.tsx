import { useContext } from "react";

import { formatPercentage, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    value: {
      percentageEvolution: number;
      difference: number;
    };
    isSuccess: boolean;
  };
};

const SummaryPermeableSurfaceAreaDescription = ({ impactData }: Props) => {
  const { isSuccess, value } = impactData;
  const { difference, percentageEvolution } = value;

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);
  const title = isSuccess ? `+ de sols perméables\u00a0☔️` : `- de sols perméables\u00a0☔️`;

  return (
    <>
      <ModalHeader
        title={title}
        value={{
          text: isSuccess ? formatSurfaceArea(difference) : formatSurfaceArea(difference),
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `(soit ${formatPercentage(percentageEvolution)}) de sols désimperméabilisés`
            : `(soit ${formatPercentage(percentageEvolution)}) de sols imperméabilisés`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent>
        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={difference}
            label="🌧 Surface perméable"
            type="surfaceArea"
            onClick={() => {
              openImpactModalDescription({
                sectionName: "environmental",
                impactName: "permeable_surface_area",
              });
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </>
  );
};

export default SummaryPermeableSurfaceAreaDescription;
