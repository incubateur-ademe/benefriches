import { ProjectData, SiteData } from "../ImpactDescriptionModalWizard";
import ModalBreadcrumb from "../shared/ModalBreadcrumb";
import RealEstateAcquisitionDescription from "./real-estate-acquisition/RealEstateAcquisition";
import EconomicBalanceDescription from "./EconomicBalanceDescription";
import { EconomicBalanceImpactDescriptionModalId } from "./types";

type Props = {
  modalId: EconomicBalanceImpactDescriptionModalId;
  onChangeModalCategoryOpened: (modalCategory: EconomicBalanceImpactDescriptionModalId) => void;
  projectData: ProjectData;
  siteData: SiteData;
};

const EconomicBalanceSectionModalContentWizard = ({
  modalId,
  onChangeModalCategoryOpened,
}: Props) => {
  switch (modalId) {
    case "economic-balance":
      return (
        <>
          <ModalBreadcrumb segments={[{ label: "Bilan de l'opération", isCurrent: true }]} />
          <EconomicBalanceDescription />
        </>
      );

    case "economic-balance.real-estate-acquisition":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Bilan de l'opération",
                onClick: () => {
                  onChangeModalCategoryOpened("economic-balance");
                },
              },
              { label: "Acquisition du site", isCurrent: true },
            ]}
          />
          <RealEstateAcquisitionDescription />
        </>
      );
  }
};
export default EconomicBalanceSectionModalContentWizard;
