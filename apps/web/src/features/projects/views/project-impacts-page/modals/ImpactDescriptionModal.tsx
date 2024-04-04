import { ReactElement, useEffect, useMemo } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import RealEstateAcquisitionDescription from "./economic-balance/RealEstateAcquisition";
import AvoidedFricheCostsDescription from "./socio-economic/AvoidedFricheCostsDescription";
import CarbonSoilsStorageMonetaryValueDescription from "./socio-economic/ecosystem-services/CarbonStorageMonetaryValueDescription";
import EcosystemServicesDescription from "./socio-economic/ecosystem-services/EcosystemServicesDescription";
import NatureRelatedWellnessAndLeisureDescription from "./socio-economic/ecosystem-services/NatureRelatedWellnessAndLeisureDescription";
import WaterRegulationDescription from "./socio-economic/WaterRegulationDescription";
import CostBenefitAnalysisDescription from "./cost-benefit-analysis";
import EconomicBalanceDescription from "./economic-balance";
import ModalBreadcrumb, { ModalBreadcrumbSegments } from "./ModalBreadcrumb";
import SocioEconomicDescription from "./socio-economic";

import { SoilsDistribution } from "@/features/projects/application/projectImpacts.reducer";

export type ImpactDescriptionModalCategory =
  | "economic-balance"
  | "cost-benefit-analysis"
  | "socio-economic"
  | "real-estate-acquisition"
  | "avoided-friche-costs"
  | "ecosystem-services"
  | "water-regulation"
  | "carbon-storage-monetary-value"
  | "nature-related-wellness-and-leisure"
  | undefined;

type Props = {
  modalCategory: ImpactDescriptionModalCategory;
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void;
  projectData: {
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: 0;
  };
  siteData: {
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

    case "real-estate-acquisition":
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

    case "avoided-friche-costs":
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
    case "water-regulation":
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

    case "ecosystem-services":
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
    case "carbon-storage-monetary-value":
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

    case "nature-related-wellness-and-leisure":
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
              onChangeModalCategoryOpened("ecosystem-services");
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

    default:
      return { title: "", content: undefined };
  }
};

const modal = createModal({
  id: `modal-impacts-description`,
  isOpenedByDefault: false,
});

export function ImpactDescriptionModal({
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
