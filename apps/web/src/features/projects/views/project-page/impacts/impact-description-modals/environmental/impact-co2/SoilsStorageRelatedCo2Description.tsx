import { convertCarbonToCO2eq } from "shared";

import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";

import { ImpactsData, ProjectData, SiteData } from "../../ImpactModalDescriptionProvider";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import SoilsStorageRelatedCo2Content from "../../shared/co2-emissions/SoilsStorageRelatedCo2Content";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  baseSoilsDistribution: SiteData["soilsDistribution"];
  forecastSoilsDistribution: ProjectData["soilsDistribution"];
  impactData: ImpactsData["environmental"]["soilsCarbonStorage"];
};

const SoilsStorageRelatedCo2Description = ({ impactData, ...props }: Props) => {
  const value = impactData.isSuccess
    ? convertCarbonToCO2eq(impactData.forecast.total - impactData.current.total)
    : undefined;

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
