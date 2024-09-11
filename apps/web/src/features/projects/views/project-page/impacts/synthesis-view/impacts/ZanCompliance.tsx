import ImpactSyntheticCard from "../ImpactSyntheticCard";

type Props = {
  isSuccess: boolean;
  isAgriculturalFriche: boolean;
  small?: boolean;
};

const ImpactSynthesisZanCompliance = ({ isAgriculturalFriche, isSuccess, ...props }: Props) => {
  if (isSuccess) {
    return (
      <ImpactSyntheticCard
        {...props}
        type="success"
        tooltipText="Reconversion d’un site en friche limitant la consommation d’espaces naturels, agricoles ou forestiers"
        text={`Projet favorable au ZAN\u00a0🌾`}
      />
    );
  }
  return (
    <ImpactSyntheticCard
      {...props}
      type="error"
      tooltipText={
        isAgriculturalFriche
          ? "Projet consommant des espaces agricoles"
          : "Projet consommant des espaces naturels, agricoles ou forestiers et imperméabilisant les sols"
      }
      text={`Projet défavorable favorable au ZAN\u00a0🌾`}
    />
  );
};

export default ImpactSynthesisZanCompliance;
