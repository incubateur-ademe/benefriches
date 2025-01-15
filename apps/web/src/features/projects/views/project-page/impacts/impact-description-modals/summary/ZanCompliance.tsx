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
  const { isSuccess, value } = impactData;
  const title = isSuccess ? `Projet favorable au ZAN\u00a0🌾` : `Projet défavorable au ZAN\u00a0🌾`;
  return (
    <>
      <ModalHeader title={title} breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]} />
      <ModalContent>
        <p>
          {isSuccess &&
            "Le projet est considéré favorable à l'objectif de Zéro Artificialisation Nette car il s'agit de la reconversion d’un site en friche limitant la consommation d’espaces naturels, agricoles ou forestiers."}
          {!isSuccess &&
            (value.isAgriculturalFriche
              ? "Le projet est considéré favorable à l'objectif de Zéro Artificialisation Nette car il s'agit d'un projet consommant des espaces agricoles."
              : "Le projet est considéré favorable à l'objectif de Zéro Artificialisation Nette car il s'agit d'un projet consommant des espaces naturels, agricoles ou forestiers et imperméabilisant les sols.")}
        </p>
      </ModalContent>
    </>
  );
};

export default SummaryZanComplianceDescription;
