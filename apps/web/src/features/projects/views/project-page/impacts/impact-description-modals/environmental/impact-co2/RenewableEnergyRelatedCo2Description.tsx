import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";

import AvoidedCO2WithEnRDescription from "../../shared/AvoidedCo2WithRenewableEnergyDescription";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
  projectData?: {
    surfaceArea: number;
    electricalPowerKWc: number;
  };
  siteData: {
    address: string;
  };
};

const AvoidedCO2WithEnREnvironmentalDescription = ({
  impactData,
  siteData,
  projectData,
}: Props) => {
  return (
    <>
      <ModalHeader
        title="⚡️️ Emissions de CO2-eq évitées grâce à la production d'énergies renouvelables"
        value={
          impactData
            ? {
                state: "success",
                text: formatCO2Impact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[
          ...breadcrumbSegments,
          {
            label: "CO2-eq évité grâce aux énergies renouvelables",
          },
        ]}
      />
      <ModalContent>
        <AvoidedCO2WithEnRDescription
          withMonetarisation={false}
          address={siteData.address}
          developmentPlanSurfaceArea={projectData?.surfaceArea}
          developmentPlanElectricalPowerKWc={projectData?.electricalPowerKWc}
        />
      </ModalContent>
    </>
  );
};

export default AvoidedCO2WithEnREnvironmentalDescription;
