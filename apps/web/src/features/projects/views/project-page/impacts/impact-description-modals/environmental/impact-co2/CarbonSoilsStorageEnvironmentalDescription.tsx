import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchReconversionProjectImpacts.action";

import CarbonSoilsStorageDescription from "../../shared/CarbonStorageDescription";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

type Props = {
  baseSoilsDistribution: ReconversionProjectImpactsResult["siteData"]["soilsDistribution"];
  forecastSoilsDistribution: ReconversionProjectImpactsResult["projectData"]["soilsDistribution"];
};

const CarbonSoilsStorageEnvironmentalDescription = (props: Props) => {
  return (
    <>
      <ModalHeader
        title="🍂️ Carbone stocké dans les sols"
        breadcrumbSegments={[breadcrumbSection, { label: "Carbone stocké dans les sols" }]}
      />
      <ModalContent>
        <CarbonSoilsStorageDescription withMonetarisation={false} {...props} />
      </ModalContent>
    </>
  );
};

export default CarbonSoilsStorageEnvironmentalDescription;
