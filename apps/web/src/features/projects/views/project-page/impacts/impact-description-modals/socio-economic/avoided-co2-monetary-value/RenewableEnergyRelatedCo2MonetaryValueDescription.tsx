import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import RenewableEnergyRelatedCo2Content from "../../shared/co2-emissions/RenewableEnergyRelatedCo2Content";
import {
  mainBreadcrumbSection,
  environmentalMonetaryBreadcrumbSection,
} from "../breadcrumbSections";

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

const AvoidedCO2WithEnRMonetaryValueDescription = ({
  impactData,
  siteData,
  projectData,
}: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="⚡️️ Production d'énergies renouvelables"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          environmentalMonetaryBreadcrumbSection,
          {
            label: "Production d'énergies renouvelables",
          },
        ]}
      />
      <ModalContent fullWidth>
        <RenewableEnergyRelatedCo2Content
          withMonetarisation={true}
          address={siteData.address}
          developmentPlanSurfaceArea={projectData?.surfaceArea}
          developmentPlanElectricalPowerKWc={projectData?.electricalPowerKWc}
        />
        ;
      </ModalContent>
    </ModalBody>
  );
};

export default AvoidedCO2WithEnRMonetaryValueDescription;
