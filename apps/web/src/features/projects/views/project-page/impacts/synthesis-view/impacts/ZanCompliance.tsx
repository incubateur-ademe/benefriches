import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  isSuccess: boolean;
  isAgriculturalFriche: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSynthesisZanCompliance = ({
  isAgriculturalFriche,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description="Reconversion d’un site en friche limitant la consommation d’espaces naturels, agricoles ou forestiers"
        title={`Projet favorable au ZAN\u00a0🌾`}
        descriptionDisplayMode={descriptionDisplayMode}
      />
    );
  }
  return (
    <KeyImpactIndicatorCard
      type="error"
      description={
        isAgriculturalFriche
          ? "Projet consommant des espaces agricoles"
          : "Projet consommant des espaces naturels, agricoles ou forestiers et imperméabilisant les sols"
      }
      title={`Projet défavorable au ZAN\u00a0🌾`}
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSynthesisZanCompliance;
