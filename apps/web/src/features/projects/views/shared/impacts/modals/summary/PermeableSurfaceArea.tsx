import { useContext } from "react";

import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { formatPercentage, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import ImpactItemDetails from "../../../../project-page/impacts/list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../../project-page/impacts/list-view/ImpactItemGroup";

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

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);
  const title = isSuccess ? `+ de sols perméables\u00a0☔️` : `- de sols perméables\u00a0☔️`;

  return (
    <ModalBody>
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
      <ModalContent noTitle>
        {isSuccess ? (
          <p>
            Le projet présente une plus grande surface de sol perméable que ce que l’on trouve
            actuellement sur le site. Cela permet une meilleure infiltration de l’eau de pluie sur
            la parcelle. La surface perméable peut être minérale ou végétalisée.
          </p>
        ) : (
          <p>
            Le projet présente une plus faible surface de sol perméable que ce que l’on trouve
            actuellement sur le site. Cela réduit la capacité d’infiltration de l’eau de pluie sur
            la parcelle. La surface perméable peut être minérale ou végétalisée.
          </p>
        )}

        <ImpactItemGroup isClickable>
          <ImpactItemDetails
            impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
            value={difference}
            label="🌧 Surface perméable"
            type="surface_area"
            labelProps={{
              onClick: (e) => {
                e.stopPropagation();
                updateModalContent({
                  sectionName: "environmental",
                  impactName: "permeable_surface_area",
                });
              },
            }}
          />
        </ImpactItemGroup>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryPermeableSurfaceAreaDescription;
