import AvoidedCO2WithEnRDescription from "../../shared/AvoidedCo2WithRenewableEnergyDescription";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

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
          breadcrumbSection,
          {
            label: "Impacts environnementaux monétarisés",
          },
          {
            label: "CO2-eq évité grâce aux énergies renouvelables",
          },
        ]}
      />
      <ModalContent>
        <AvoidedCO2WithEnRDescription withMonetarisation={true} {...props} />;
      </ModalContent>
    </>
  );
};

export default AvoidedCO2WithEnRMonetaryValueDescription;
