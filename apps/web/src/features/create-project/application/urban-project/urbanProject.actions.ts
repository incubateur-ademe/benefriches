import { createAction as _createAction } from "@reduxjs/toolkit";
import {
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
  UrbanSpaceCategory,
} from "shared";
import { z } from "zod";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { ProjectStakeholderStructure } from "../../domain/project.types";
import { BuildingsEconomicActivityUse, BuildingsUseCategory } from "../../domain/urbanProject";

export function prefixActionType(actionType: string) {
  return `projectCreation/urbanProject/${actionType}`;
}

const createAction = <TPayload = void>(actionName: string) =>
  _createAction<TPayload>(prefixActionType(actionName));

export const createModeStepReverted = createAction("createModeStepReverted");

const schema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  createdBy: z.string(),
  category: z.enum([
    "PUBLIC_FACILITIES",
    "RESIDENTIAL_TENSE_AREA",
    "RESIDENTIAL_NORMAL_AREA",
    "NEW_URBAN_CENTER",
  ]),
});
type ExpressReconversionProjectPayload = z.infer<typeof schema>;
export interface SaveExpressReconversionProjectGateway {
  save(payload: ExpressReconversionProjectPayload): Promise<{ id: string; name: string }>;
}
export const expressCategorySelected = createAppAsyncThunk<
  { id: string; name: string },
  ExpressReconversionProjectPayload["category"]
>(prefixActionType("expressCreateModeSelected"), async (expressCategory, { getState, extra }) => {
  const { projectCreation, currentUser } = getState();
  const expressProjectPayload = await schema.parseAsync({
    reconversionProjectId: projectCreation.projectId,
    siteId: projectCreation.siteData?.id,
    category: expressCategory,
    createdBy: currentUser.currentUser?.id,
  });

  return await extra.saveExpressReconversionProjectService.save(expressProjectPayload);
});

export const resultStepReverted = createAction("resultStepReverted");
export const expressCategoryStepReverted = createAction("expressCategoryStepReverted");

export const customCreateModeSelected = createAction("customCreateModeSelected");
export const expressCreateModeSelected = createAction("expressCreateModeSelected");

export const spacesIntroductionCompleted = createAction("spacesIntroductionCompleted");
export const spacesIntroductionReverted = createAction("spacesIntroductionReverted");
export const spacesSelectionCompleted = createAction<{
  spacesCategories: UrbanSpaceCategory[];
}>("spacesSelectionCompleted");
export const spacesSelectionReverted = createAction("spacesSelectionReverted");
export const spacesSurfaceAreaCompleted = createAction<{
  surfaceAreaDistribution: Partial<Record<UrbanSpaceCategory, number>>;
}>("spacesSurfaceAreaCompleted");
export const spacesSurfaceAreaReverted = createAction("spacesSurfaceAreaReverted");
export const spacesDevelopmentPlanIntroductionCompleted = createAction(
  "spacesDevelopmentPlanIntroductionCompleted",
);
export const spacesDevelopmentPlanIntroductionReverted = createAction(
  "spacesDevelopmentPlanIntroductionReverted",
);

// green spaces
export const greenSpacesIntroductionCompleted = createAction("greenSpacesIntroductionCompleted");
export const greenSpacesIntroductionReverted = createAction("greenSpacesIntroductionReverted");
export const greenSpacesSelectionCompleted = createAction<{ greenSpaces: UrbanGreenSpace[] }>(
  "greenSpacesSelectionCompleted",
);
export const greenSpacesSelectionReverted = createAction("greenSpacesSelectionReverted");
export const greenSpacesDistributionCompleted = createAction<{
  surfaceAreaDistribution: Partial<Record<UrbanGreenSpace, number>>;
}>("greenSpacesDistributionCompleted");
export const greenSpacesDistributionReverted = createAction("greenSpacesDistributionReverted");

// living and activity spaces
export const livingAndActivitySpacesIntroductionCompleted = createAction(
  "livingAndActivitySpacesIntroductionCompleted",
);
export const livingAndActivitySpacesIntroductionReverted = createAction(
  "livingAndActivitySpacesIntroductionReverted",
);
export const livingAndActivitySpacesSelectionCompleted = createAction<
  UrbanLivingAndActivitySpace[]
>("livingAndActivitySpacesSelectionCompleted");
export const livingAndActivitySpacesSelectionReverted = createAction(
  "livingAndActivitySpacesSelectionReverted",
);
export const livingAndActivitySpacesDistributionCompleted = createAction<
  Partial<Record<UrbanLivingAndActivitySpace, number>>
>("livingAndActivitySpacesDistributionCompleted");
export const livingAndActivitySpacesDistributionReverted = createAction(
  "livingAndActivitySpacesDistributionReverted",
);

// public spaces
export const publicSpacesIntroductionCompleted = createAction("publicSpacesIntroductionCompleted");
export const publicSpacesIntroductionReverted = createAction("publicSpacesIntroductionReverted");
export const publicSpacesSelectionCompleted = createAction<UrbanPublicSpace[]>(
  "publicSpacesSelectionCompleted",
);
export const publicSpacesSelectionReverted = createAction("publicSpacesSelectionReverted");
export const publicSpacesDistributionCompleted = createAction<
  Partial<Record<UrbanPublicSpace, number>>
>("publicSpacesDistributionCompleted");
export const publicSpacesDistributionReverted = createAction("publicSpacesDistributionReverted");

// soils summary and carbon storage
export const soilsSummaryCompleted = createAction("soilsSummaryCompleted");
export const soilsSummaryReverted = createAction("soilsSummaryReverted");

export const soilsCarbonStorageCompleted = createAction("soilsCarbonStorageCompleted");
export const soilsCarbonStorageReverted = createAction("soilsCarbonStorageReverted");

// soils decontamination
export const soilsDecontaminationIntroductionCompleted = createAction(
  "soilsDecontaminationIntroductionCompleted",
);
export const soilsDecontaminationIntroductionReverted = createAction(
  "soilsDecontaminationIntroductionReverted",
);
export const soilsDecontaminationSelectionCompleted = createAction<
  "all" | "partial" | "unknown" | "none"
>("soilsDecontaminationSelectionCompleted");
export const soilsDecontaminationSelectionReverted = createAction(
  "soilsDecontaminationSelectionReverted",
);
export const soilsDecontaminationSurfaceAreaCompleted = createAction<number>(
  "soilsDecontaminationSurfaceAreaCompleted",
);
export const soilsDecontaminationSurfaceAreaReverted = createAction(
  "soilsDecontaminationSurfaceAreaReverted",
);

// buildings
export const buildingsIntroductionCompleted = createAction("buildingsIntroductionCompleted");
export const buildingsIntroductionReverted = createAction("buildingsIntroductionReverted");
export const buildingsFloorSurfaceAreaCompleted = createAction<number>(
  "buildingsFloorSurfaceAreaCompleted",
);
export const buildingsFloorSurfaceAreaReverted = createAction("buildingsFloorSurfaceAreaReverted");
export const buildingsUseIntroductionCompleted = createAction("buildingsUseIntroductionCompleted");
export const buildingsUseIntroductionReverted = createAction("buildingsUseIntroductionReverted");
export const buildingsUseCategorySelectionCompleted = createAction<BuildingsUseCategory[]>(
  "buildingsUseCategorySelectionCompleted",
);
export const buildingsUseCategorySelectionReverted = createAction(
  "buildingsUseCategorySelectionReverted",
);
export const buildingsUseCategorySurfaceAreasCompleted = createAction<
  Partial<Record<BuildingsUseCategory, number>>
>("buildingsUseCategorySurfaceAreasCompleted");
export const buildingsUseCategorySurfaceAreasReverted = createAction(
  "buildingsUseCategorySurfaceAreasReverted",
);
export const buildingsEconomicActivitySelectionCompleted = createAction<
  BuildingsEconomicActivityUse[]
>("buildingsEconomicActivitySelectionCompleted");
export const buildingsEconomicActivitySelectionReverted = createAction(
  "buildingsEconomicActivitySelectionReverted",
);
export const buildingsEconomicActivitySurfaceAreasCompleted = createAction<
  Partial<Record<BuildingsEconomicActivityUse, number>>
>("buildingsEconomicActivitySurfaceAreasCompleted");
export const buildingsEconomicActivitySurfaceAreasReverted = createAction(
  "buildingsEconomicActivitySurfaceAreasReverted",
);

// stakeholders
export const stakeholderIntroductionCompleted = createAction("stakeholderIntroductionCompleted");
export const stakeholderIntroductionReverted = createAction("stakeholderIntroductionReverted");
export const stakeholderProjectDeveloperCompleted = createAction<{
  name: string;
  structureType: ProjectStakeholderStructure;
}>("stakeholderProjectDeveloperCompleted");
export const stakeholderProjectDeveloperReverted = createAction(
  "stakeholderProjectDeveloperReverted",
);
export const stakeholderReinstatementContractOwnerCompleted = createAction<{
  name: string;
  structureType: ProjectStakeholderStructure;
}>("stakeholderReinstatementContractOwnerCompleted");
export const stakeholderReinstatementContractOwnerReverted = createAction(
  "stakeholderReinstatementContractOwnerReverted",
);
