import { ProjectData, SiteData } from "../ImpactDescriptionModalWizard";
import ModalBreadcrumb from "../shared/ModalBreadcrumb";
import AvoidedCO2WithEnREnvironmentalDescription from "./impact-co2/AvoidedCO2WithEnREnvironmentalDescription";
import CarbonSoilsStorageEnvironmentalDescription from "./impact-co2/CarbonSoilsStorageEnvironmentalDescription";
import NonContaminatedSurfaceDescription from "./non-contaminated-surface/NonContaminatedSurface";
import PermeableGreenSurfaceDescription from "./permeable-surface/PermeableGreenSurface";
import PermeableMineraleSurfaceDescription from "./permeable-surface/PermeableMineraleSurface";
import PermeableSurfaceDescription from "./permeable-surface/PermeableSurface";
import EnvironmentalMainDescription from "./EnvironmentalMainDescription";
import { EnvironmentalImpactDescriptionModalId } from "./types";

type Props = {
  modalId: EnvironmentalImpactDescriptionModalId;
  onChangeModalCategoryOpened: (modalCategory: EnvironmentalImpactDescriptionModalId) => void;
  projectData: ProjectData;
  siteData: SiteData;
};

const EnvironmentalSectionModalContentWizard = ({
  modalId,
  onChangeModalCategoryOpened,
  projectData,
  siteData,
}: Props) => {
  switch (modalId) {
    case "environmental":
      return <EnvironmentalMainDescription />;

    case "environmental.avoided-co2-renewable-energy":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts environnementaux",
                onClick: () => {
                  onChangeModalCategoryOpened("environmental");
                },
              },
              {
                label: "CO2-eq évité grâce aux énergies renouvelables",
                isCurrent: true,
              },
            ]}
          />
          <AvoidedCO2WithEnREnvironmentalDescription
            address={siteData.addressLabel}
            developmentPlanElectricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
            developmentPlanSurfaceArea={projectData.developmentPlan.surfaceArea}
          />
        </>
      );
    case "environmental.carbon-storage":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts environnementaux",
                onClick: () => {
                  onChangeModalCategoryOpened("environmental");
                },
              },
              { label: "Carbone stocké dans les sols", isCurrent: true },
            ]}
          />
          <CarbonSoilsStorageEnvironmentalDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );
    case "environmental.non-contamined-surface":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts environnementaux",
                onClick: () => {
                  onChangeModalCategoryOpened("environmental");
                },
              },
              { label: "Surface non polluée", isCurrent: true },
            ]}
          />
          <NonContaminatedSurfaceDescription />
        </>
      );

    case "environmental.permeable-surface":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts environnementaux",
                onClick: () => {
                  onChangeModalCategoryOpened("environmental");
                },
              },
              { label: "Surface perméable", isCurrent: true },
            ]}
          />
          <PermeableSurfaceDescription onChangeModalCategoryOpened={onChangeModalCategoryOpened} />
        </>
      );

    case "environmental.minerale-surface":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts environnementaux",
                onClick: () => {
                  onChangeModalCategoryOpened("environmental");
                },
              },
              {
                label: "Surface perméable",
                onClick: () => {
                  onChangeModalCategoryOpened("environmental.permeable-surface");
                },
              },
              { label: "Surface minérale", isCurrent: true },
            ]}
          />
          <PermeableMineraleSurfaceDescription />
        </>
      );

    case "environmental.green-surface":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts environnementaux",
                onClick: () => {
                  onChangeModalCategoryOpened("environmental");
                },
              },
              {
                label: "Surface perméable",
                onClick: () => {
                  onChangeModalCategoryOpened("environmental.permeable-surface");
                },
              },
              { label: "Surface végétalisée", isCurrent: true },
            ]}
          />
          <PermeableGreenSurfaceDescription />
        </>
      );
  }
};
export default EnvironmentalSectionModalContentWizard;
