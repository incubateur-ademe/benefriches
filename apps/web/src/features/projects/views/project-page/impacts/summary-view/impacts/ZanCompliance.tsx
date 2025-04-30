import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  isSuccess: boolean;
  isAgriculturalFriche: boolean;
  buttonProps: {
    "data-fr-opened": boolean;
    "aria-controls": string;
  };
  noDescription?: boolean;
};

const ImpactSummaryZanCompliance = ({
  isAgriculturalFriche,
  isSuccess,
  noDescription = false,
  ...props
}: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={
          noDescription
            ? undefined
            : "Reconversion d’un site en friche limitant la consommation d’espaces naturels, agricoles ou forestiers"
        }
        title={`Projet favorable au ZAN\u00a0🌾`}
        {...props}
      />
    );
  }
  return (
    <KeyImpactIndicatorCard
      type="error"
      description={
        noDescription
          ? undefined
          : isAgriculturalFriche
            ? "Projet consommant des espaces agricoles"
            : "Projet consommant des espaces naturels, agricoles ou forestiers et imperméabilisant les sols"
      }
      title={`Projet défavorable au ZAN\u00a0🌾`}
      {...props}
    />
  );
};

export default ImpactSummaryZanCompliance;
