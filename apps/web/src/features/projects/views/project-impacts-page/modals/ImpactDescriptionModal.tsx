import { ReactElement, useEffect, useMemo } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import CostBenefitAnalysisDescription from "./cost-benefit-analysis";
import EconomicBalanceDescription from "./economic-balance";
import ModalBreadcrumb, { ModalBreadcrumbSegments } from "./ModalBreadcrumb";
import SocioEconomicDescription from "./socio-economic";

export type ImpactDescriptionModalCategory =
  | "economic-balance"
  | "cost-benefit-analysis"
  | "socio-economic"
  | undefined;

type Props = {
  modalCategory: ImpactDescriptionModalCategory;
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void;
};

const getModalContent = (
  modalCategory: Props["modalCategory"],
  onChangeModalCategoryOpened: Props["onChangeModalCategoryOpened"],
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
    default:
      return { title: "", content: undefined };
  }
};

const modal = createModal({
  id: `modal-impacts-description`,
  isOpenedByDefault: false,
});

export function ImpactDescriptionModal({ modalCategory, onChangeModalCategoryOpened }: Props) {
  const { title, content, breadcrumbSegments } = useMemo(
    () => getModalContent(modalCategory, onChangeModalCategoryOpened),
    [modalCategory, onChangeModalCategoryOpened],
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
