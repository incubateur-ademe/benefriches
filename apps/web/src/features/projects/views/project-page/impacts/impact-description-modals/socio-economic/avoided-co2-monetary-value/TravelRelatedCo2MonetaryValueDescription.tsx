import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import TravelRelatedCo2Content from "../../shared/co2-emissions/TravelRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  impactData?: number;
};

const TravelRelatedCo2MonetaryValueDescription = ({ impactData }: Props) => {
  return (
    <>
      <ModalHeader
        title="🚙 Déplacements en voiture évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatCO2Impact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Déplacements en voiture évités" }]}
      />
      <ModalContent>
        <TravelRelatedCo2Content withMonetarisation />
      </ModalContent>
    </>
  );
};

export default TravelRelatedCo2MonetaryValueDescription;
