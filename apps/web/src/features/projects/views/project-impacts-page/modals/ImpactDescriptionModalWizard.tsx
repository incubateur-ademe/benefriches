import { ReactElement, useEffect, useMemo } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import CostBenefitAnalysisDescription from "./cost-benefit-analysis/CostBenefitAnalysisDescription";
import EconomicBalanceDescription from "./economic-balance/EconomicBalanceDescription";
import RealEstateAcquisitionDescription from "./economic-balance/RealEstateAcquisition";
import EnvironmentalMainDescription from "./environmental/EnvironmentalMainDescription";
import AvoidedCO2WithEnREnvironmentalDescription from "./environmental/impact-co2/AvoidedCO2WithEnREnvironmentalDescription";
import CarbonSoilsStorageEnvironmentalDescription from "./environmental/impact-co2/CarbonSoilsStorageEnvironmentalDescription";
import NonContaminatedSurfaceDescription from "./environmental/NonContaminatedSurface";
import PermeableGreenSurfaceDescription from "./environmental/permeable-surface/PermeableGreenSurface";
import PermeableMineraleSurfaceDescription from "./environmental/permeable-surface/PermeableMineraleSurface";
import PermeableSurfaceDescription from "./environmental/permeable-surface/PermeableSurface";
import ModalBreadcrumb, { ModalBreadcrumbSegments } from "./shared/ModalBreadcrumb";
import HouseholdsPoweredByRenewableEnergyDescription from "./social/HouseholdsPoweredByRenewableEnergy";
import SocialMainDescription from "./social/SocialMainDescription";
import AvoidedCO2WithEnRMonetaryValueDescription from "./socio-economic/avoided-co2-monetary-value/AvoidedCo2WithRenewableEnergyMonetaryValueDescription";
import AvoidedFricheCostsDescription from "./socio-economic/AvoidedFricheCostsDescription";
import CarbonSoilsStorageMonetaryValueDescription from "./socio-economic/ecosystem-services/CarbonStorageMonetaryValueDescription";
import EcosystemServicesDescription from "./socio-economic/ecosystem-services/EcosystemServicesDescription";
import NatureRelatedWellnessAndLeisureDescription from "./socio-economic/ecosystem-services/NatureRelatedWellnessAndLeisureDescription";
import SocioEconomicDescription from "./socio-economic/SocioEconomicDescription";
import WaterRegulationDescription from "./socio-economic/WaterRegulationDescription";

import { SoilsDistribution } from "@/features/projects/application/projectImpacts.reducer";

export type ImpactDescriptionModalCategory =
  | "economic-balance"
  | "cost-benefit-analysis"
  | "socio-economic"
  | "economic-balance-real-estate-acquisition"
  | "socio-economic-avoided-friche-costs"
  | "socio-economic-ecosystem-services"
  | "socio-economic-avoided-co2-renewable-energy"
  | "socio-economic-water-regulation"
  | "socio-economic-carbon-storage"
  | "socio-economic-nature-related-wellness-and-leisure"
  | "social"
  | "social-households-powered-by-renewable-energy"
  | "environmental"
  | "environmental-avoided-co2-renewable-energy"
  | "environmental-carbon-storage"
  | "environmental-non-contamined-surface"
  | "environmental-permeable-surface"
  | "environmental-green-surface"
  | "environmental-minerale-surface"
  | undefined;

type Props = {
  modalCategory: ImpactDescriptionModalCategory;
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void;
  projectData: {
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: 0;
    developmentPlan: {
      surfaceArea?: number;
      electricalPowerKWc?: number;
    };
  };
  siteData: {
    addressLabel: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
  };
};

const getModalContent = (
  modalCategory: Props["modalCategory"],
  onChangeModalCategoryOpened: Props["onChangeModalCategoryOpened"],
  projectData: Props["projectData"],
  siteData: Props["siteData"],
): { title: string; content?: ReactElement; breadcrumbSegments?: ModalBreadcrumbSegments } => {
  switch (modalCategory) {
    case "cost-benefit-analysis":
      return {
        title: "⚖️ Analyse coûts bénéfices",
        content: (
          <CostBenefitAnalysisDescription
            onChangeModalCategoryOpened={onChangeModalCategoryOpened}
          />
        ),
      };
    case "economic-balance":
      return {
        title: "📉 Bilan de l’opération",
        breadcrumbSegments: [
          {
            label: "Analyse coûts bénéfices",
            onClick: () => {
              onChangeModalCategoryOpened("cost-benefit-analysis");
            },
          },
          { label: "Bilan de l’opération", isCurrent: true },
        ],
        content: <EconomicBalanceDescription />,
      };
    case "socio-economic":
      return {
        title: "🌍 Impacts socio-économiques",
        breadcrumbSegments: [
          {
            label: "Analyse coûts bénéfices",
            onClick: () => {
              onChangeModalCategoryOpened("cost-benefit-analysis");
            },
          },
          { label: "Impacts socio-économiques", isCurrent: true },
        ],
        content: <SocioEconomicDescription />,
      };

    case "economic-balance-real-estate-acquisition":
      return {
        title: "🏠 Acquisition du site",
        breadcrumbSegments: [
          {
            label: "Bilan de l’opération",
            onClick: () => {
              onChangeModalCategoryOpened("economic-balance");
            },
          },
          { label: "Acquisition du site", isCurrent: true },
        ],
        content: <RealEstateAcquisitionDescription />,
      };

    case "socio-economic-avoided-friche-costs":
      return {
        title: "🏚 Dépenses de gestion et de sécurisation de la friche évitées",
        breadcrumbSegments: [
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
        ],
        content: <AvoidedFricheCostsDescription />,
      };
    case "socio-economic-avoided-co2-renewable-energy":
      return {
        title: "⚡️️ Emissions de CO2-eq évitées grâce à la production d’énergies renouvelables",
        breadcrumbSegments: [
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
        ],
        content: (
          <AvoidedCO2WithEnRMonetaryValueDescription
            address={siteData.addressLabel}
            developmentPlanElectricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
            developmentPlanSurfaceArea={projectData.developmentPlan.surfaceArea}
          />
        ),
      };
    case "socio-economic-water-regulation":
      return {
        title: "🚰 Régulation de la qualité de l’eau",
        breadcrumbSegments: [
          {
            label: "Impacts socio-économiques",
            onClick: () => {
              onChangeModalCategoryOpened("socio-economic");
            },
          },
          { label: "Régulation de la qualité de l’eau", isCurrent: true },
        ],
        content: (
          <WaterRegulationDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
            baseContaminatedSurface={siteData.contaminatedSoilSurface}
            forecastContaminatedSurface={projectData.contaminatedSoilSurface}
          />
        ),
      };

    case "socio-economic-ecosystem-services":
      return {
        title: "🌻 Services écosystémiques",
        breadcrumbSegments: [
          {
            label: "Impacts socio-économiques",
            onClick: () => {
              onChangeModalCategoryOpened("socio-economic");
            },
          },
          { label: "Services écosystémiques", isCurrent: true },
        ],
        content: <EcosystemServicesDescription />,
      };
    case "socio-economic-carbon-storage":
      return {
        title: "🍂️ Carbone stocké dans les sols",
        breadcrumbSegments: [
          {
            label: "Impacts socio-économiques",
            onClick: () => {
              onChangeModalCategoryOpened("socio-economic");
            },
          },
          {
            label: "Services écosystémiques",
            onClick: () => {
              onChangeModalCategoryOpened("socio-economic");
            },
          },
          { label: "Carbone stocké dans les sols", isCurrent: true },
        ],
        content: (
          <CarbonSoilsStorageMonetaryValueDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        ),
      };

    case "socio-economic-nature-related-wellness-and-leisure":
      return {
        title: "🚵‍♂️ Loisirs et bien-être liés à la nature",
        breadcrumbSegments: [
          {
            label: "Impacts socio-économiques",
            onClick: () => {
              onChangeModalCategoryOpened("socio-economic");
            },
          },
          {
            label: "Services écosystémiques",
            onClick: () => {
              onChangeModalCategoryOpened("socio-economic-ecosystem-services");
            },
          },
          { label: "Loisirs et bien-être liés à la nature", isCurrent: true },
        ],
        content: (
          <NatureRelatedWellnessAndLeisureDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        ),
      };

    case "social":
      return {
        title: "Impacts sociaux",
        content: <SocialMainDescription />,
      };

    case "social-households-powered-by-renewable-energy":
      return {
        title: "🏠 Foyers alimentés par les EnR",
        breadcrumbSegments: [
          {
            label: "Impacts sociaux",
            onClick: () => {
              onChangeModalCategoryOpened("social");
            },
          },
          { label: "Foyers alimentés par les EnR", isCurrent: true },
        ],
        content: (
          <HouseholdsPoweredByRenewableEnergyDescription
            address={siteData.addressLabel}
            developmentPlanElectricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
            developmentPlanSurfaceArea={projectData.developmentPlan.surfaceArea}
          />
        ),
      };
    case "environmental":
      return {
        title: "Impacts environnementaux",
        content: <EnvironmentalMainDescription />,
      };
    case "environmental-avoided-co2-renewable-energy":
      return {
        title: "⚡️️ Emissions de CO2-eq évitées grâce à la production d’énergies renouvelables",
        breadcrumbSegments: [
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
        ],
        content: (
          <AvoidedCO2WithEnREnvironmentalDescription
            address={siteData.addressLabel}
            developmentPlanElectricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
            developmentPlanSurfaceArea={projectData.developmentPlan.surfaceArea}
          />
        ),
      };

    case "environmental-carbon-storage":
      return {
        title: "🍂️ Carbone stocké dans les sols",
        breadcrumbSegments: [
          {
            label: "Impacts environnementaux",
            onClick: () => {
              onChangeModalCategoryOpened("environmental");
            },
          },
          { label: "Carbone stocké dans les sols", isCurrent: true },
        ],
        content: (
          <CarbonSoilsStorageEnvironmentalDescription
            baseSoilsDistribution={siteData.soilsDistribution}
            forecastSoilsDistribution={projectData.soilsDistribution}
          />
        ),
      };

    case "environmental-non-contamined-surface":
      return {
        title: "✨ Surface non polluée",
        breadcrumbSegments: [
          {
            label: "Impacts environnementaux",
            onClick: () => {
              onChangeModalCategoryOpened("environmental");
            },
          },
          { label: "Surface non polluée", isCurrent: true },
        ],
        content: <NonContaminatedSurfaceDescription />,
      };
    case "environmental-permeable-surface":
      return {
        title: "🌧 Surface perméable",
        breadcrumbSegments: [
          {
            label: "Impacts environnementaux",
            onClick: () => {
              onChangeModalCategoryOpened("environmental");
            },
          },
          { label: "Surface perméable", isCurrent: true },
        ],
        content: (
          <PermeableSurfaceDescription onChangeModalCategoryOpened={onChangeModalCategoryOpened} />
        ),
      };
    case "environmental-minerale-surface":
      return {
        title: "🪨 Surface minérale",
        breadcrumbSegments: [
          {
            label: "Impacts environnementaux",
            onClick: () => {
              onChangeModalCategoryOpened("environmental");
            },
          },
          {
            label: "Surface perméable",
            onClick: () => {
              onChangeModalCategoryOpened("environmental-permeable-surface");
            },
          },
          { label: "Surface minérale", isCurrent: true },
        ],
        content: <PermeableMineraleSurfaceDescription />,
      };
    case "environmental-green-surface":
      return {
        title: "☘️ Surface végétalisée",
        breadcrumbSegments: [
          {
            label: "Impacts environnementaux",
            onClick: () => {
              onChangeModalCategoryOpened("environmental");
            },
          },
          {
            label: "Surface perméable",
            onClick: () => {
              onChangeModalCategoryOpened("environmental-permeable-surface");
            },
          },
          { label: "Surface végétalisée", isCurrent: true },
        ],
        content: <PermeableGreenSurfaceDescription />,
      };

    default:
      return { title: "", content: undefined };
  }
};

const modal = createModal({
  id: `modal-impacts-description`,
  isOpenedByDefault: false,
});

export function ImpactDescriptionModalWizard({
  modalCategory,
  onChangeModalCategoryOpened,
  projectData,
  siteData,
}: Props) {
  const { title, content, breadcrumbSegments } = useMemo(
    () => getModalContent(modalCategory, onChangeModalCategoryOpened, projectData, siteData),
    [modalCategory, onChangeModalCategoryOpened, projectData, siteData],
  );

  useIsModalOpen(modal, {
    onConceal: () => {
      onChangeModalCategoryOpened(undefined);
    },
  });

  useEffect(() => {
    if (modalCategory) {
      modal.open();
    }
  }, [modalCategory]);

  return (
    <modal.Component title={title} concealingBackdrop={true} size="large">
      {breadcrumbSegments && <ModalBreadcrumb segments={breadcrumbSegments} />}
      {content}
    </modal.Component>
  );
}
