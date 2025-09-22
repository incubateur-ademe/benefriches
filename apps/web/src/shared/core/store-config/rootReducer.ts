import { combineReducers } from "@reduxjs/toolkit";

import { appSettingsReducer as appSettings } from "@/features/app-settings/core/appSettings";
import projectCreation from "@/features/create-project/core/createProject.reducer";
import siteCreation from "@/features/create-site/core/createSite.reducer";
import siteMunicipalityData from "@/features/create-site/core/siteMunicipalityData.reducer";
import siteCarbonStorage from "@/features/create-site/core/siteSoilsCarbonStorage.reducer";
import { fricheMutabilityReducer } from "@/features/friche-mutability/core/fricheMutability.reducer";
import { authReducer as auth } from "@/features/onboarding/core/auth.reducer";
import { currentUserReducer } from "@/features/onboarding/core/user.reducer";
import { projectFeaturesReducer } from "@/features/projects/application/project-features/projectFeatures.reducer";
import urbanSprawlComparison from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import { projectImpactsReducer } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import reconversionProjectsList from "@/features/projects/application/projects-list/projectsList.reducer";
import siteFeatures from "@/features/site-features/core/siteFeatures.reducer";
import userFeatureAlert from "@/features/user-feature-alerts/core/userFeatureAlert.reducer";

export const rootReducer = combineReducers({
  appSettings,
  auth,
  siteCreation,
  siteFeatures,
  projectCreation,
  siteCarbonStorage,
  reconversionProjectsList,
  currentUser: currentUserReducer,
  userFeatureAlert,
  urbanSprawlComparison,
  projectImpacts: projectImpactsReducer,
  projectFeatures: projectFeaturesReducer,
  siteMunicipalityData,
  fricheMutability: fricheMutabilityReducer,
});
