import { ReactElement, useEffect, useMemo } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { SoilsDistribution } from "shared";
import { getEconomicBalanceSectionModalTitle } from "./economic-balance/getTitle";
import EconomicBalanceSectionModalContentWizard from "./economic-balance/ModalContentWizard";
import { EconomicBalanceImpactDescriptionModalId } from "./economic-balance/types";
import { getEnvironmentalSectionModalTitle } from "./environmental/getTitle";
import EnvironmentalSectionModalContentWizard from "./environmental/ModalContentWizard";
import { EnvironmentalImpactDescriptionModalId } from "./environmental/types";
import { getSocialSectionModalTitle } from "./social/getTitle";
import SocialSectionModalContentWizard from "./social/ModalContentWizard";
import { SocialImpactDescriptionModalId } from "./social/types";
import { getSocioEconomicSectionModalTitle } from "./socio-economic/getTitle";
import SocioEconomicModalContentWizard from "./socio-economic/ModalContentWizard";
import { SocioEconomicImpactDescriptionModalId } from "./socio-economic/types";

export type ImpactSectionName = "economic-balance" | "socio-economic" | "social" | "environmental";

export type ImpactDescriptionModalCategory =
  | EconomicBalanceImpactDescriptionModalId
  | SocioEconomicImpactDescriptionModalId
  | SocialImpactDescriptionModalId
  | EnvironmentalImpactDescriptionModalId
  | undefined;

export type ProjectData = {
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface: 0;
  developmentPlan: {
    surfaceArea?: number;
    electricalPowerKWc?: number;
  };
};

export type SiteData = {
  soilsDistribution: SoilsDistribution;
  contaminatedSoilSurface: number;
  addressLabel: string;
};

type Props = {
  modalCategory: ImpactDescriptionModalCategory;
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void;
  projectData: ProjectData;
  siteData: SiteData;
};

const getModalTitleAndContent = (
  modalId: Props["modalCategory"],
  onChangeModalCategoryOpened: Props["onChangeModalCategoryOpened"],
  projectData: Props["projectData"],
  siteData: Props["siteData"],
): { title: string; content?: ReactElement } => {
  if (!modalId) {
    return { title: "", content: undefined };
  }
  const section = modalId.split(".")[0] as ImpactSectionName;

  switch (section) {
    case "economic-balance":
      return {
        title: getEconomicBalanceSectionModalTitle(
          modalId as EconomicBalanceImpactDescriptionModalId,
        ),
        content: (
          <EconomicBalanceSectionModalContentWizard
            modalId={modalId as EconomicBalanceImpactDescriptionModalId}
            projectData={projectData}
            siteData={siteData}
            onChangeModalCategoryOpened={onChangeModalCategoryOpened}
          />
        ),
      };
    case "socio-economic":
      return {
        title: getSocioEconomicSectionModalTitle(modalId as SocioEconomicImpactDescriptionModalId),
        content: (
          <SocioEconomicModalContentWizard
            modalId={modalId as SocioEconomicImpactDescriptionModalId}
            projectData={projectData}
            siteData={siteData}
            onChangeModalCategoryOpened={onChangeModalCategoryOpened}
          />
        ),
      };

    case "social":
      return {
        title: getSocialSectionModalTitle(modalId as SocialImpactDescriptionModalId),
        content: (
          <SocialSectionModalContentWizard
            modalId={modalId as SocialImpactDescriptionModalId}
            projectData={projectData}
            siteData={siteData}
            onChangeModalCategoryOpened={onChangeModalCategoryOpened}
          />
        ),
      };

    case "environmental":
      return {
        title: getEnvironmentalSectionModalTitle(modalId as EnvironmentalImpactDescriptionModalId),
        content: (
          <EnvironmentalSectionModalContentWizard
            modalId={modalId as EnvironmentalImpactDescriptionModalId}
            projectData={projectData}
            siteData={siteData}
            onChangeModalCategoryOpened={onChangeModalCategoryOpened}
          />
        ),
      };
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
  const { title, content } = useMemo(
    () =>
      getModalTitleAndContent(modalCategory, onChangeModalCategoryOpened, projectData, siteData),
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
      {content}
    </modal.Component>
  );
}
