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
      decontaminatedSurfaceArea: number;
      forecastContaminatedSurfaceArea: number;
    };
    isSuccess: boolean;
  };
};

const SummaryNonContaminatedSurfaceAreaDescription = ({ impactData }: Props) => {
  const { isSuccess, value } = impactData;
  const { decontaminatedSurfaceArea, forecastContaminatedSurfaceArea, percentageEvolution } = value;
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);
  const title = isSuccess
    ? `Des risques sanitaires réduits\u00a0☢️`
    : `des sols encore pollués\u00a0☢️`;

  return (
    <ModalBody>
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
      <ModalContent noTitle>
        {isSuccess ? (
          <>
            <p>
              Les friches sont bien souvent concernées par des pollutions des sols, vestiges des
              activités passées. Réaliser un projet sur un tel site implique donc souvent la mise en
              place de mesure de gestion des pollutions (ex : traitement de dépollution) pour
              réduire l’ampleur de la pollution (surface occupée, teneurs présentes, etc.) et les
              risques sanitaires associés, pour les futurs usagers (habitants, salariés, etc.).
            </p>
            <ImpactItemGroup isClickable>
              <ImpactItemDetails
                impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
                value={decontaminatedSurfaceArea}
                label="✨ Surface non polluée"
                type="surface_area"
                labelProps={{
                  onClick: (e) => {
                    e.stopPropagation();
                    updateModalContent({
                      sectionName: "environmental",
                      impactName: "non_contaminated_surface_area",
                    });
                  },
                }}
              />
            </ImpactItemGroup>
          </>
        ) : (
          <>
            <p>
              Les friches sont bien souvent concernées par des pollutions des sols, vestiges des
              activités passées. Réaliser un projet sur un tel site implique donc souvent la mise en
              place de mesure de gestion des pollutions (ex : traitement de dépollution) pour
              réduire l’ampleur de la pollution (surface occupée, teneurs présentes, etc.) et les
              risques sanitaires associés, pour les futurs usagers (habitants, salariés, etc.).
            </p>
            <p> Ainsi, en l’absence de dépollution envisagée, ces risques peuvent demeurer.</p>
          </>
        )}
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryNonContaminatedSurfaceAreaDescription;
