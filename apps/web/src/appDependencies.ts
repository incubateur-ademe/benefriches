import { SoilsCarbonSequestrationApi } from "./features/create-site/infrastructure/soils-carbon-storage-service/soilsCarbonSequestrationApi";
import { AppDependencies } from "./store";

export const appDependencies: AppDependencies = {
  soilsCarbonSequestrationService: new SoilsCarbonSequestrationApi(),
};
