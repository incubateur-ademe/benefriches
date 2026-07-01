import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import RenewableEnergyRelatedCo2Content from "../../shared/co2-emissions/RenewableEnergyRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
  projectDevelopmentPlan?: {
    installationSurfaceArea: number;
    installationElectricalPowerKWc: number;
  };
  siteAddress: string;
};

const RenewableEnergyRelatedCo2Description = ({
  impactData,
  siteAddress,
  projectDevelopmentPlan,
}: Props) => {
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
          address={siteAddress}
          developmentPlanSurfaceArea={projectDevelopmentPlan?.installationSurfaceArea}
          developmentPlanElectricalPowerKWc={projectDevelopmentPlan?.installationElectricalPowerKWc}
        />
      </ModalContent>
    </ModalBody>
  );
};

export default RenewableEnergyRelatedCo2Description;
