import AvoidedCO2WithEnRDescription from "../../shared/AvoidedCo2WithRenewableEnergyDescription";

type Props = {
  address: string;
  developmentPlanSurfaceArea?: number;
  developmentPlanElectricalPowerKWc?: number;
};

const AvoidedCO2WithEnREnvironmentalDescription = (props: Props) => {
  return <AvoidedCO2WithEnRDescription withMonetarisation={false} {...props} />;
};

export default AvoidedCO2WithEnREnvironmentalDescription;
