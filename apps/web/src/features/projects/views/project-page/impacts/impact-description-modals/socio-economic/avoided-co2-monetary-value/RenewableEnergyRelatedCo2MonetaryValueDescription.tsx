import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import RenewableEnergyRelatedCo2Content from "../../shared/co2-emissions/RenewableEnergyRelatedCo2Content";
import {
  mainBreadcrumbSection,
  environmentalMonetaryBreadcrumbSection,
} from "../breadcrumbSections";

type Props = {
  address: string;
  developmentPlanSurfaceArea?: number;
  developmentPlanElectricalPowerKWc?: number;
};

const AvoidedCO2WithEnRMonetaryValueDescription = (props: Props) => {
  return (
    <>
      <ModalHeader
        title="⚡️️ Production d'énergies renouvelables"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          environmentalMonetaryBreadcrumbSection,
          {
            label: "Production d'énergies renouvelables",
          },
        ]}
      />
      <ModalContent>
        <RenewableEnergyRelatedCo2Content withMonetarisation={true} {...props} />;
      </ModalContent>
    </>
  );
};

export default AvoidedCO2WithEnRMonetaryValueDescription;
