import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
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
    <ModalBody>
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
      <ModalContent>
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
