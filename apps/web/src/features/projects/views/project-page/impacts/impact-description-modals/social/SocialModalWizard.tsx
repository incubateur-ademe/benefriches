import {
  SocialImpactDetailsName,
  SocialMainImpactName,
} from "@/features/projects/domain/projectImpactsSocial";

import { getSocialImpactLabel } from "../../getImpactLabel";
import ImpactInProgressDescriptionModal from "../ImpactInProgressDescriptionModal";
import { ProjectData, SiteData } from "../ImpactModalDescriptionProvider";
import SocialMainDescription from "./SocialMainDescription";
import AvoidedVehiculeKilometersDescription from "./avoided-vehicule-kilometers/AvoidedVehiculeKilometersDescription";
import { breadcrumbSection as socialBreadcrumbSection } from "./breadcrumbSection";
import FullTimeJobsDescription from "./full-time-jobs/FullTimeJobsDescription";
import PhotovoltaicOperationFullTimeJobsDescription from "./full-time-jobs/PhotovoltaicOperationFullTimeJobsDescription";
import ReconversionFullTimeJobsDescription from "./full-time-jobs/ReconversionFullTimeJobsDescription";
import UrbanProjectOperationFullTimeJobsDescription from "./full-time-jobs/UrbanProjectOperationFullTimeJobsDescription";
import HouseholdsPoweredByRenewableEnergyDescription from "./householdsPoweredByEnR/householdsPoweredByEnR";
import TimeTravelSavedDescription from "./time-travel-saved/TimeTravelSavedDescription";

type Props = {
  impactName?: SocialMainImpactName;
  impactDetailsName?: SocialImpactDetailsName;
  projectData: ProjectData;
  siteData: SiteData;
};

export function SocialModalWizard({ impactName, impactDetailsName, projectData, siteData }: Props) {
  if (!impactName) {
    return <SocialMainDescription />;
  }

  switch (impactDetailsName ?? impactName) {
    case "full_time_jobs":
      return <FullTimeJobsDescription />;
    case "conversion_full_time_jobs":
      return (
        <ReconversionFullTimeJobsDescription
          isPhotovoltaic={projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"}
        />
      );
    case "operations_full_time_jobs":
      return projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ? (
        <PhotovoltaicOperationFullTimeJobsDescription
          electricalPowerKWc={projectData.developmentPlan.electricalPowerKWc}
        />
      ) : (
        <UrbanProjectOperationFullTimeJobsDescription
          groundFloorRetailSurface={
            projectData.developmentPlan.buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0
          }
        />
      );
    case "households_powered_by_renewable_energy":
      return (
        <HouseholdsPoweredByRenewableEnergyDescription
          address={siteData.addressLabel}
          developmentPlanElectricalPowerKWc={
            projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
              ? projectData.developmentPlan.electricalPowerKWc
              : undefined
          }
          developmentPlanSurfaceArea={
            projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
              ? projectData.developmentPlan.surfaceArea
              : undefined
          }
        />
      );

    case "avoided_vehicule_kilometers":
      return <AvoidedVehiculeKilometersDescription />;
    case "travel_time_saved":
      return <TimeTravelSavedDescription />;

    default:
      return (
        <ImpactInProgressDescriptionModal
          title={getSocialImpactLabel(impactDetailsName ?? impactName)}
          breadcrumbProps={{
            section: socialBreadcrumbSection,
            segments: impactDetailsName && [
              {
                label: getSocialImpactLabel(impactName),
                openState: { sectionName: "social", impactName },
              },
            ],
          }}
        />
      );
  }
}
