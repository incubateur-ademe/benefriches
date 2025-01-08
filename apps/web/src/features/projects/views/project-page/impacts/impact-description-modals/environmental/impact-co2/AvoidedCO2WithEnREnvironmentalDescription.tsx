import AvoidedCO2WithEnRDescription from "../../shared/AvoidedCo2WithRenewableEnergyDescription";
import ModalHeader from "../../shared/ModalHeader";

type Props = {
  address: string;
  developmentPlanSurfaceArea?: number;
  developmentPlanElectricalPowerKWc?: number;
};

const AvoidedCO2WithEnREnvironmentalDescription = (props: Props) => {
  return (
    <>
      <ModalHeader
        title="⚡️️ Emissions de CO2-eq évitées grâce à la production d'énergies renouvelables"
        breadcrumbSegments={[
          {
            label: "Impacts environnementaux",
            id: "environmental",
          },
          {
            label: "CO2-eq évité grâce aux énergies renouvelables",
          },
        ]}
      />
      <AvoidedCO2WithEnRDescription withMonetarisation={false} {...props} />
    </>
  );
};

export default AvoidedCO2WithEnREnvironmentalDescription;
