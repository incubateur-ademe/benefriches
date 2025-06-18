import { combineReducers } from "@reduxjs/toolkit";

import { appSettingsReducer as appSettings } from "@/features/app-settings/core/appSettings";
import projectCreation from "@/features/create-project/core/createProject.reducer";
import siteCreation from "@/features/create-site/core/createSite.reducer";
import siteMunicipalityData from "@/features/create-site/core/siteMunicipalityData.reducer";
import siteCarbonStorage from "@/features/create-site/core/siteSoilsCarbonStorage.reducer";
import currentUser from "@/features/onboarding/core/user.reducer";
import { projectFeaturesReducer } from "@/features/projects/application/project-features/projectFeatures.reducer";
import urbanSprawlComparison from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import projectImpacts from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import reconversionProjectsList from "@/features/projects/application/projects-list/projectsList.reducer";
import siteFeatures from "@/features/site-features/core/siteFeatures.reducer";
import userFeatureAlert from "@/features/user-feature-alerts/core/userFeatureAlert.reducer";

export const rootReducer = combineReducers({
  appSettings,
  siteCreation,
  siteFeatures,
  projectCreation,
  siteCarbonStorage,
  reconversionProjectsList,
  currentUser,
  userFeatureAlert,
  projectImpacts,
  urbanSprawlComparison,
  projectFeatures: projectFeaturesReducer,
  siteMunicipalityData,
});
