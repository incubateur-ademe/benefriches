import { ProjectData, SiteData } from "../ImpactDescriptionModalWizard";
import ModalBreadcrumb from "../shared/ModalBreadcrumb";
import AvoidedVehiculeKilometersDescription from "./avoided-vehicule-kilometers/AvoidedVehiculeKilometersDescription";
import HouseholdsPoweredByRenewableEnergyDescription from "./householdsPoweredByEnR/householdsPoweredByEnR";
import TimeTravelSavedDescription from "./time-travel-saved/TimeTravelSavedDescription";
import SocialMainDescription from "./SocialMainDescription";
import { SocialImpactDescriptionModalId } from "./types";

type Props = {
  modalId: SocialImpactDescriptionModalId;
  onChangeModalCategoryOpened: (modalCategory: SocialImpactDescriptionModalId) => void;
  projectData: ProjectData;
  siteData: SiteData;
};

const SocialSectionModalContentWizard = ({
  modalId,
  onChangeModalCategoryOpened,
  projectData,
  siteData,
}: Props) => {
  switch (modalId) {
    case "social":
      return <SocialMainDescription />;

    case "social.households-powered-by-renewable-energy":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts sociaux",
                onClick: () => {
                  onChangeModalCategoryOpened("social");
                },
              },
              { label: "Foyers alimentés par les EnR", isCurrent: true },
            ]}
          />
          <HouseholdsPoweredByRenewableEnergyDescription
            address={siteData.addressLabel}
            developmentPlanElectricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
            developmentPlanSurfaceArea={projectData.developmentPlan.surfaceArea}
          />
        </>
      );
    case "social.avoided-vehicule-kilometers":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts sociaux",
                onClick: () => {
                  onChangeModalCategoryOpened("social");
                },
              },
              { label: "Kilomètres évités", isCurrent: true },
            ]}
          />
          <AvoidedVehiculeKilometersDescription />
        </>
      );
    case "social.time-travel-saved":
      return (
        <>
          <ModalBreadcrumb
            segments={[
              {
                label: "Impacts sociaux",
                onClick: () => {
                  onChangeModalCategoryOpened("social");
                },
              },
              { label: "Temps de déplacement économisé", isCurrent: true },
            ]}
          />
          <TimeTravelSavedDescription />
        </>
      );
  }
};
export default SocialSectionModalContentWizard;
