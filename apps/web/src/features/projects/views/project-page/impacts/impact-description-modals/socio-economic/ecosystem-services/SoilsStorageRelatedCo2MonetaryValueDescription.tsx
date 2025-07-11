import { SoilsDistribution } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import SoilsStorageRelatedCo2Content from "../../shared/co2-emissions/SoilsStorageRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
  impactData?: number;
};

const SoilsStorageRelatedCo2MonetaryValueDescription = (props: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🍂 CO2-eq stocké dans les sols"
        value={
          props.impactData
            ? {
                state: props.impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(props.impactData),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Carbone stocké dans les sols" }]}
      />
      <ModalContent fullWidth>
        <SoilsStorageRelatedCo2Content withMonetarisation={true} {...props} />
      </ModalContent>
    </ModalBody>
  );
};

export default SoilsStorageRelatedCo2MonetaryValueDescription;
