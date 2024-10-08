import { ProjectData, SiteData } from "../ImpactDescriptionModalWizard";
import ModalBreadcrumb from "../shared/ModalBreadcrumb";
import SocialMainDescription from "./SocialMainDescription";
import AvoidedVehiculeKilometersDescription from "./avoided-vehicule-kilometers/AvoidedVehiculeKilometersDescription";
import FullTimeJobsDescription from "./full-time-jobs/FullTimeJobsDescription";
import PhotovoltaicOperationFullTimeJobsDescription from "./full-time-jobs/PhotovoltaicOperationFullTimeJobsDescription";
import ReconversionFullTimeJobsDescription from "./full-time-jobs/ReconversionFullTimeJobsDescription";
import UrbanProjectOperationFullTimeJobsDescription from "./full-time-jobs/UrbanProjectOperationFullTimeJobsDescription";
import HouseholdsPoweredByRenewableEnergyDescription from "./householdsPoweredByEnR/householdsPoweredByEnR";
import TimeTravelSavedDescription from "./time-travel-saved/TimeTravelSavedDescription";
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

    case "social.full-time-jobs":
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
              { label: "Emplois équivalent temps plein", isCurrent: true },
            ]}
          />
          <FullTimeJobsDescription onChangeModalCategoryOpened={onChangeModalCategoryOpened} />
        </>
      );
    case "social.full-time-reconversion-jobs":
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
              {
                label: "Emplois équivalent temps plein",
                onClick: () => {
                  onChangeModalCategoryOpened("social.full-time-jobs");
                },
              },
              { label: "Mobilisés pour la reconversion du site", isCurrent: true },
            ]}
          />
          <ReconversionFullTimeJobsDescription
            isPhotovoltaic={projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"}
          />
        </>
      );

    case "social.full-time-operation-jobs":
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
              {
                label: "Emplois équivalent temps plein",
                onClick: () => {
                  onChangeModalCategoryOpened("social.full-time-jobs");
                },
              },
              { label: "Mobilisés pour l’exploitation du site", isCurrent: true },
            ]}
          />
          {projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ? (
            <PhotovoltaicOperationFullTimeJobsDescription
              electricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
            />
          ) : (
            <UrbanProjectOperationFullTimeJobsDescription
              groundFloorRetailSurface={
                projectData.developmentPlan.buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0
              }
            />
          )}
        </>
      );

    case "social.households-powered-by-renewable-energy": {
      const surfaceArea =
        projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
          ? projectData.developmentPlan.surfaceArea
          : undefined;
      const electricalPowerKWc =
        projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
          ? projectData.developmentPlan.electricalPowerKWc
          : undefined;
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
            developmentPlanElectricalPowerKWc={electricalPowerKWc}
            developmentPlanSurfaceArea={surfaceArea}
          />
        </>
      );
    }

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
