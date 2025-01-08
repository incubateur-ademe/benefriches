import AvoidedCO2WithEnRDescription from "../../shared/AvoidedCo2WithRenewableEnergyDescription";
import ModalHeader from "../../shared/ModalHeader";

type Props = {
  address: string;
  developmentPlanSurfaceArea?: number;
  developmentPlanElectricalPowerKWc?: number;
};

const AvoidedCO2WithEnRMonetaryValueDescription = (props: Props) => {
  return (
    <>
      <ModalHeader
        title="⚡️️ Emissions de CO2-eq évitées grâce à la production d'énergies renouvelables"
        breadcrumbSegments={[
          {
            label: "Impacts socio-économiques",
            id: "socio-economic",
          },
          {
            label: "Impacts environnementaux monétarisés",
          },
          {
            label: "CO2-eq évité grâce aux énergies renouvelables",
          },
        ]}
      />
      <AvoidedCO2WithEnRDescription withMonetarisation={true} {...props} />;
    </>
  );
};

export default AvoidedCO2WithEnRMonetaryValueDescription;
