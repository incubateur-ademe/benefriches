import type { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

type Props = {
  impactData: Extract<KeyImpactIndicatorData, { name: "zanCompliance" }>;
};

const SummaryZanComplianceDescription = ({ impactData }: Props) => {
  const { isSuccess } = impactData;
  const title = isSuccess ? `Projet favorable au ZAN\u00a0🌾` : `Projet défavorable au ZAN\u00a0🌾`;

  const description = (() => {
    if (isSuccess) {
      return "Le projet est considéré favorable à l'objectif de Zéro Artificialisation Nette car il s'agit de la reconversion d'un site en friche limitant la consommation d'espaces naturels, agricoles ou forestiers.";
    }
    if (impactData.value.isAgriculturalFriche) {
      return "Le projet est considéré défavorable à l'objectif de Zéro Artificialisation Nette car il imperméabilise des sols agricoles.";
    }
    if (
      impactData.value.permeableSurfaceAreaDifference !== undefined &&
      impactData.value.permeableSurfaceAreaDifference < 0
    ) {
      return "Le projet est considéré défavorable à l'objectif de Zéro Artificialisation Nette car il imperméabilise des sols.";
    }
    return "Le projet est considéré défavorable à l'objectif de Zéro Artificialisation Nette car il consomme des espaces naturels, agricoles ou forestiers.";
  })();
  return (
    <ModalBody size="small">
      <ModalHeader title={title} breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]} />
      <ModalContent noTitle>
        <p>{description}</p>
        {!isSuccess && impactData.value.artificializedSurfaceArea > 0 && (
          <p>
            Le projet artificialise {formatSurfaceArea(impactData.value.artificializedSurfaceArea)}.
          </p>
        )}
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryZanComplianceDescription;
