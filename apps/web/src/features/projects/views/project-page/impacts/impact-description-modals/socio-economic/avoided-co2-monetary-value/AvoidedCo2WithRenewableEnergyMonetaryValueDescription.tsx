import AvoidedCO2WithEnRDescription from "../../shared/AvoidedCo2WithRenewableEnergyDescription";

type Props = {
  address: string;
  developmentPlanSurfaceArea?: number;
  developmentPlanElectricalPowerKWc?: number;
};

const AvoidedCO2WithEnRMonetaryValueDescription = (props: Props) => {
  return <AvoidedCO2WithEnRDescription withMonetarisation={true} {...props} />;
};

export default AvoidedCO2WithEnRMonetaryValueDescription;
