import { ImpactsData, ProjectData, SiteData } from "../ImpactDescriptionModalWizard";
import ModalBreadcrumb from "../shared/ModalBreadcrumb";
import AvoidedCO2WithEnRMonetaryValueDescription from "./avoided-co2-monetary-value/AvoidedCo2WithRenewableEnergyMonetaryValueDescription";
import AvoidedFricheCostsDescription from "./avoided-friche-costs/AvoidedFricheCostsDescription";
import AvoidedIllegalDumpingCostsDescription from "./avoided-friche-costs/AvoidedIllegalDumpingCostsDescription";
import AvoidedOtherSecuringCostsDescription from "./avoided-friche-costs/AvoidedOtherSecuringCostsDescription";
import AvoidedSecurityCostsDescription from "./avoided-friche-costs/AvoidedSecurityCostsDescription";
import CarbonSoilsStorageMonetaryValueDescription from "./ecosystem-services/CarbonStorageMonetaryValueDescription";
import EcosystemServicesDescription from "./ecosystem-services/EcosystemServicesDescription";
import InvasiveSpeciesRegulationDescription from "./ecosystem-services/InvasiveSpeciesRegulationDescription";
import NatureRelatedWellnessAndLeisureDescription from "./ecosystem-services/NatureRelatedWellnessAndLeisureDescription";
import NitrogenCycleDescription from "./ecosystem-services/NitrogenCycleDescription";
import PollinationDescription from "./ecosystem-services/PollinationDescription";
import SoilErosionDescription from "./ecosystem-services/SoilErosionDescription";
import WaterCycle from "./ecosystem-services/WaterCycle";
import PropertyTransferDutiesIncreaseDescription from "./property-value-increase/PropertyTransferDutiesIncreaseDescription";
import PropertyValueIncreaseDescription from "./property-value-increase/PropertyValueIncreaseDescription";
import RentalIncomeDescription from "./rental-income/RentalIncomeDescription";
import WaterRegulationDescription from "./water-regulation/WaterRegulationDescription";
import SocioEconomicDescription from "./SocioEconomicDescription";
import { SocioEconomicImpactDescriptionModalId } from "./types";

type Props = {
  modalId: SocioEconomicImpactDescriptionModalId;
  onChangeModalCategoryOpened: (modalCategory: SocioEconomicImpactDescriptionModalId) => void;
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ImpactsData;
};

const SocioEconomicEcosystemServicesContentWizard = ({
  modalId,
  onChangeModalCategoryOpened,
  projectData,
  siteData,
  impactsData,
}: Props) => {
  const modalSegments = [
    {
      label: "Impacts socio-économiques",
      onClick: () => {
        onChangeModalCategoryOpened("socio-economic");
      },
    },
    {
      label: "Impacts environnementaux monétarisés",
    },
    {
      label: "Services écosystémiques",
      onClick: () => {
        onChangeModalCategoryOpened("socio-economic.ecosystem-services");
      },
    },
  ];

  switch (modalId) {
    case "socio-economic.ecosystem-services":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts environnementaux monétarisés",
              },
              { label: "Services écosystémiques", isCurrent: true },
            ]}
          />
          <EcosystemServicesDescription
            onChangeModalCategoryOpened={onChangeModalCategoryOpened}
            impactsData={impactsData}
          />
        </>
      );

    case "socio-economic.ecosystem-services.carbon-storage":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              ...modalSegments,
              { label: "Carbone stocké dans les sols", isCurrent: true },
            ]}
          />
          <CarbonSoilsStorageMonetaryValueDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );

    case "socio-economic.ecosystem-services.nature-related-wellness-and-leisure":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              ...modalSegments,
              { label: "Loisirs et bien-être liés à la nature", isCurrent: true },
            ]}
          />
          <NatureRelatedWellnessAndLeisureDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );
    case "socio-economic.ecosystem-services.forest-related-product":
      return (
        <>
          <ModalBreadcrumb
            segments={[...modalSegments, { label: "Produits issus de la forêt", isCurrent: true }]}
          />
          <NatureRelatedWellnessAndLeisureDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );

    case "socio-economic.ecosystem-services.invasive-species-regulation":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              ...modalSegments,
              { label: "Régulation des espèces invasives", isCurrent: true },
            ]}
          />
          <InvasiveSpeciesRegulationDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );
    case "socio-economic.ecosystem-services.nitrogen-cycle":
      return (
        <>
          <ModalBreadcrumb
            segments={[...modalSegments, { label: "Cycle de l'azote", isCurrent: true }]}
          />
          <NitrogenCycleDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );
    case "socio-economic.ecosystem-services.pollinisation":
      return (
        <>
          <ModalBreadcrumb
            segments={[...modalSegments, { label: "Pollinisation", isCurrent: true }]}
          />
          <PollinationDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );
    case "socio-economic.ecosystem-services.soil-erosion":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              ...modalSegments,
              { label: "Régulation de l'érosion des sols", isCurrent: true },
            ]}
          />
          <SoilErosionDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );
    case "socio-economic.ecosystem-services.water-cycle":
      return (
        <>
          <ModalBreadcrumb
            segments={[...modalSegments, { label: "Cycle de l'eau", isCurrent: true }]}
          />
          <WaterCycle
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );
  }
};

const SocioEconomicModalContentWizard = ({
  modalId,
  onChangeModalCategoryOpened,
  projectData,
  siteData,
  impactsData,
}: Props) => {
  switch (modalId) {
    case "socio-economic":
      return (
        <>
          <ModalBreadcrumb segments={[{ label: "Impacts socio-économiques", isCurrent: true }]} />
          <SocioEconomicDescription />
        </>
      );

    case "socio-economic.rental-income":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts économiques directs",
              },
              { label: "Dépenses friche évitées", isCurrent: true },
            ]}
          />
          <RentalIncomeDescription developmentPlan={projectData.developmentPlan} />
        </>
      );

    case "socio-economic.avoided-friche-costs":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts économiques directs",
              },
              { label: "Dépenses friche évitées", isCurrent: true },
            ]}
          />
          <AvoidedFricheCostsDescription />
        </>
      );

    case "socio-economic.avoided-illegal-dumping-costs":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts économiques directs",
              },
              {
                label: "Dépenses friche évitées",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic.avoided-friche-costs");
                },
              },

              { label: "Débarras de dépôt sauvage", isCurrent: true },
            ]}
          />
          <AvoidedIllegalDumpingCostsDescription addressLabel={siteData.addressLabel} />
        </>
      );
    case "socio-economic.avoided-security-costs":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts économiques directs",
              },
              {
                label: "Dépenses friche évitées",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic.avoided-friche-costs");
                },
              },

              { label: "Gardiennage", isCurrent: true },
            ]}
          />
          <AvoidedSecurityCostsDescription siteSurfaceArea={siteData.surfaceArea} />
        </>
      );

    case "socio-economic.avoided-other-securing-costs":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts économiques directs",
              },
              {
                label: "Dépenses friche évitées",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic.avoided-friche-costs");
                },
              },

              { label: "Autres dépenses", isCurrent: true },
            ]}
          />
          <AvoidedOtherSecuringCostsDescription />
        </>
      );

    case "socio-economic.property-value-increase":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts économiques indirects",
              },
              { label: "Valeur patrimoniale des bâtiments alentour", isCurrent: true },
            ]}
          />
          <PropertyValueIncreaseDescription siteSurfaceArea={siteData.surfaceArea} />
        </>
      );
    case "socio-economic.property-transfer-duties-increase":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts économiques indirects",
              },
              { label: "Droits de mutation sur les ventes immobilières alentour", isCurrent: true },
            ]}
          />
          <PropertyTransferDutiesIncreaseDescription />
        </>
      );
    case "socio-economic.avoided-co2-renewable-energy":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts environnementaux monétarisés",
              },
              {
                label: "CO2-eq évité grâce aux énergies renouvelables",
                isCurrent: true,
              },
            ]}
          />
          <AvoidedCO2WithEnRMonetaryValueDescription
            address={siteData.addressLabel}
            developmentPlanElectricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
            developmentPlanSurfaceArea={projectData.developmentPlan.surfaceArea}
          />
        </>
      );

    case "socio-economic.water-regulation":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts socio-économiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic");
                },
              },
              {
                label: "Impacts environnementaux monétarisés",
              },
              { label: "Régulation de la qualité de l'eau", isCurrent: true },
            ]}
          />
          <WaterRegulationDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
            baseContaminatedSurface={siteData.contaminatedSoilSurface}
            forecastContaminatedSurface={projectData.contaminatedSoilSurface}
          />
        </>
      );

    case "socio-economic.ecosystem-services":
    case "socio-economic.ecosystem-services.carbon-storage":
    case "socio-economic.ecosystem-services.nature-related-wellness-and-leisure":
    case "socio-economic.ecosystem-services.forest-related-product":
    case "socio-economic.ecosystem-services.invasive-species-regulation":
    case "socio-economic.ecosystem-services.nitrogen-cycle":
    case "socio-economic.ecosystem-services.pollinisation":
    case "socio-economic.ecosystem-services.soil-erosion":
    case "socio-economic.ecosystem-services.water-cycle":
      return (
        <SocioEconomicEcosystemServicesContentWizard
          modalId={modalId as SocioEconomicImpactDescriptionModalId}
          projectData={projectData}
          siteData={siteData}
          impactsData={impactsData}
          onChangeModalCategoryOpened={onChangeModalCategoryOpened}
        />
      );
  }
};
export default SocioEconomicModalContentWizard;
