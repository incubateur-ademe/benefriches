import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    isSuccess: boolean;
    value: {
      isAgriculturalFriche: boolean;
    };
  };
};

const SummaryZanComplianceDescription = ({ impactData }: Props) => {
  const { isSuccess } = impactData;
  const title = isSuccess ? `Projet favorable au ZAN\u00a0🌾` : `Projet défavorable au ZAN\u00a0🌾`;
  return (
    <ModalBody size="small">
      <ModalHeader title={title} breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]} />
      <ModalContent>
        <p>
          {isSuccess
            ? "Le projet est considéré favorable à l'objectif de Zéro Artificialisation Nette car il s'agit de la reconversion d’un site en friche limitant la consommation d’espaces naturels, agricoles ou forestiers."
            : "Le projet est considéré défavorable à l'objectif de Zéro Artificialisation Nette car il consomme des espaces naturels, agricoles ou forestiers."}
        </p>
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryZanComplianceDescription;
