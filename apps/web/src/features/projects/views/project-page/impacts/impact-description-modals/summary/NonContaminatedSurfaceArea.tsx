import { useContext } from "react";

import { formatPercentage, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    value: {
      percentageEvolution: number;
      decontaminatedSurfaceArea: number;
      forecastContaminatedSurfaceArea: number;
    };
    isSuccess: boolean;
  };
};

const SummaryNonContaminatedSurfaceAreaDescription = ({ impactData }: Props) => {
  const { isSuccess, value } = impactData;
  const { decontaminatedSurfaceArea, forecastContaminatedSurfaceArea, percentageEvolution } = value;
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);
  const title = isSuccess
    ? `Des risques sanitaires réduits\u00a0☢️`
    : `des sols encore pollués\u00a0☢️`;

  return (
    <>
      <ModalHeader
        title={title}
        value={{
          text: isSuccess
            ? formatSurfaceArea(decontaminatedSurfaceArea)
            : formatSurfaceArea(forecastContaminatedSurfaceArea),
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `(soit ${formatPercentage(percentageEvolution)}) de sols dépollués`
            : `de sols non dépollués`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent>
        {isSuccess ? (
          <ImpactItemGroup isClickable>
            <ImpactItemDetails
              impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
              value={decontaminatedSurfaceArea}
              label="✨ Surface non polluée"
              type="surfaceArea"
              onClick={() => {
                openImpactModalDescription({
                  sectionName: "environmental",
                  impactName: "non_contaminated_surface_area",
                });
              }}
            />
          </ImpactItemGroup>
        ) : (
          <p>
            <i>En cours de rédaction...</i>
          </p>
        )}
      </ModalContent>
    </>
  );
};

export default SummaryNonContaminatedSurfaceAreaDescription;
