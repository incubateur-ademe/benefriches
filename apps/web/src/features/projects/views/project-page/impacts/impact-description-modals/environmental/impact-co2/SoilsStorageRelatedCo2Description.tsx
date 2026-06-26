import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { ModalDataProps } from "../../ImpactModalDescription";
import SoilsStorageRelatedCo2Content from "../../shared/co2-emissions/SoilsStorageRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  baseSoilsDistribution: ModalDataProps["siteData"]["soilsDistribution"];
  forecastSoilsDistribution: ModalDataProps["projectData"]["soilsDistribution"];
  impactData?: number;
};

const SoilsStorageRelatedCo2Description = ({ impactData: value, ...props }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🍂 CO2-eq stocké dans les sols"
        value={
          value
            ? {
                state: value > 0 ? "success" : "error",
                text: formatCO2Impact(value),
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Carbone stocké dans les sols" }]}
      />
      <ModalContent fullWidth>
        <SoilsStorageRelatedCo2Content withMonetarisation={false} {...props} />
      </ModalContent>
    </ModalBody>
  );
};

export default SoilsStorageRelatedCo2Description;
