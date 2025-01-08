import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { ReactElement, useContext, useEffect, useLayoutEffect, useMemo } from "react";
import { ReconversionProjectImpacts } from "shared";

import { ImpactModalDescriptionContext } from "./ImpactModalDescriptionContext";
import { ProjectData, SiteData } from "./ImpactModalDescriptionProvider";
import EconomicBalanceSectionModalContentWizard from "./economic-balance/ModalContentWizard";
import { getEconomicBalanceSectionModalTitle } from "./economic-balance/getTitle";
import { EconomicBalanceImpactDescriptionModalId } from "./economic-balance/types";
import EnvironmentalSectionModalContentWizard from "./environmental/ModalContentWizard";
import { getEnvironmentalSectionModalTitle } from "./environmental/getTitle";
import { EnvironmentalImpactDescriptionModalId } from "./environmental/types";
import SocialSectionModalContentWizard from "./social/ModalContentWizard";
import { getSocialSectionModalTitle } from "./social/getTitle";
import { SocialImpactDescriptionModalId } from "./social/types";
import SocioEconomicModalContentWizard from "./socio-economic/ModalContentWizard";
import { getSocioEconomicSectionModalTitle } from "./socio-economic/getTitle";
import { SocioEconomicImpactDescriptionModalId } from "./socio-economic/types";

type ImpactSectionName = "economic-balance" | "socio-economic" | "social" | "environmental";

export type ImpactDescriptionModalCategory =
  | EconomicBalanceImpactDescriptionModalId
  | SocioEconomicImpactDescriptionModalId
  | SocialImpactDescriptionModalId
  | EnvironmentalImpactDescriptionModalId
  | undefined;

type Props = {
  projectData: ProjectData;
  siteData: SiteData;
  impactsData: ReconversionProjectImpacts;
};

const getModalTitleAndContent = (
  modalId: ImpactDescriptionModalCategory,
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void,
  projectData: Props["projectData"],
  siteData: Props["siteData"],
  impactsData: Props["impactsData"],
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
            impactsData={impactsData}
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

export function ImpactDescriptionModalWizard({ projectData, siteData, impactsData }: Props) {
  const {
    resetOpenState,
    openState: modalCategory,
    openImpactModalDescription: onChangeModalCategoryOpened,
  } = useContext(ImpactModalDescriptionContext);

  const { title, content } = useMemo(
    () =>
      getModalTitleAndContent(
        modalCategory,
        onChangeModalCategoryOpened,
        projectData,
        siteData,
        impactsData,
      ),
    [impactsData, modalCategory, onChangeModalCategoryOpened, projectData, siteData],
  );

  useIsModalOpen(modal, {
    onConceal: resetOpenState,
  });

  useEffect(() => {
    if (modalCategory) {
      modal.open();
    }
  }, [modalCategory]);

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${modal.id} .fr-modal__body`);
    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [title]);

  return (
    <modal.Component
      className="modal-with-breadcrumb"
      title={title}
      concealingBackdrop={true}
      size="large"
    >
      {content}
    </modal.Component>
  );
}
