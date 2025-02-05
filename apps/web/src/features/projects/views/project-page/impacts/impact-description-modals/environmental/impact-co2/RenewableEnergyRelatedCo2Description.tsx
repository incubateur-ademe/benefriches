import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import RenewableEnergyRelatedCo2Content from "../../shared/co2-emissions/RenewableEnergyRelatedCo2Content";
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

const RenewableEnergyRelatedCo2Description = ({ impactData, siteData, projectData }: Props) => {
  return (
    <ModalBody size="large">
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
      <ModalContent fullWidth>
        <RenewableEnergyRelatedCo2Content
          withMonetarisation={false}
          address={siteData.address}
          developmentPlanSurfaceArea={projectData?.surfaceArea}
          developmentPlanElectricalPowerKWc={projectData?.electricalPowerKWc}
        />
      </ModalContent>
    </ModalBody>
  );
};

export default RenewableEnergyRelatedCo2Description;
