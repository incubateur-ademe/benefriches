import { ProjectData, SiteData } from "../ImpactDescriptionModalWizard";
import ModalBreadcrumb from "../shared/ModalBreadcrumb";
import AvoidedCO2WithEnRMonetaryValueDescription from "./avoided-co2-monetary-value/AvoidedCo2WithRenewableEnergyMonetaryValueDescription";
import AvoidedFricheCostsDescription from "./avoided-friche-costs/AvoidedFricheCostsDescription";
import AvoidedIllegalDumpingCostsDescription from "./avoided-friche-costs/AvoidedIllegalDumpingCostsDescription";
import AvoidedOtherSecuringCostsDescription from "./avoided-friche-costs/AvoidedOtherSecuringCostsDescription";
import AvoidedSecurityCostsDescription from "./avoided-friche-costs/AvoidedSecurityCostsDescription";
import CarbonSoilsStorageMonetaryValueDescription from "./ecosystem-services/CarbonStorageMonetaryValueDescription";
import EcosystemServicesDescription from "./ecosystem-services/EcosystemServicesDescription";
import NatureRelatedWellnessAndLeisureDescription from "./ecosystem-services/NatureRelatedWellnessAndLeisureDescription";
import WaterRegulationDescription from "./water-regulation/WaterRegulationDescription";
import SocioEconomicDescription from "./SocioEconomicDescription";
import { SocioEconomicImpactDescriptionModalId } from "./types";

type Props = {
  modalId: SocioEconomicImpactDescriptionModalId;
  onChangeModalCategoryOpened: (modalCategory: SocioEconomicImpactDescriptionModalId) => void;
  projectData: ProjectData;
  siteData: SiteData;
};

const SocioEconomicModalContentWizard = ({
  modalId,
  onChangeModalCategoryOpened,
  projectData,
  siteData,
}: Props) => {
  switch (modalId) {
    case "socio-economic":
      return (
        <>
          <ModalBreadcrumb segments={[{ label: "Impacts socio-économiques", isCurrent: true }]} />
          <SocioEconomicDescription />
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

              { label: "Autres coûts", isCurrent: true },
            ]}
          />
          <AvoidedOtherSecuringCostsDescription />
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
              { label: "Services écosystémiques", isCurrent: true },
            ]}
          />
          <EcosystemServicesDescription />
        </>
      );

    case "socio-economic.carbon-storage":
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
                label: "Services écosystémiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic.ecosystem-services");
                },
              },
              { label: "Carbone stocké dans les sols", isCurrent: true },
            ]}
          />
          <CarbonSoilsStorageMonetaryValueDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );

    case "socio-economic.nature-related-wellness-and-leisure":
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
                label: "Services écosystémiques",
                onClick: () => {
                  onChangeModalCategoryOpened("socio-economic.ecosystem-services");
                },
              },
              { label: "Loisirs et bien-être liés à la nature", isCurrent: true },
            ]}
          />
          <NatureRelatedWellnessAndLeisureDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        </>
      );
  }
};
export default SocioEconomicModalContentWizard;
