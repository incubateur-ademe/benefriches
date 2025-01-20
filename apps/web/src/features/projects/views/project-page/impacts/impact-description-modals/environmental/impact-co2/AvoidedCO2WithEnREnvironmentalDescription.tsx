import AvoidedCO2WithEnRDescription from "../../shared/AvoidedCo2WithRenewableEnergyDescription";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { co2BreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

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
          mainBreadcrumbSection,
          co2BreadcrumbSection,
          {
            label: "CO2-eq évité grâce aux énergies renouvelables",
          },
        ]}
      />
      <ModalContent>
        <AvoidedCO2WithEnRDescription withMonetarisation={false} {...props} />
      </ModalContent>
    </>
  );
};

export default AvoidedCO2WithEnREnvironmentalDescription;
