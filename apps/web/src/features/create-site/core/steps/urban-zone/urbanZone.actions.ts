import type { UrbanZoneType } from "shared";

import { createStepCompletedAction } from "../../actions/actionsUtils";

export const urbanZoneTypeCompleted = createStepCompletedAction<{ urbanZoneType: UrbanZoneType }>(
  "URBAN_ZONE_TYPE",
);

export const urbanZoneLandParcelsIntroductionCompleted = createStepCompletedAction(
  "URBAN_ZONE_LAND_PARCELS_INTRODUCTION",
);
