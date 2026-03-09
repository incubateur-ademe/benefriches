import type { UrbanZoneType } from "shared";

import { createStepCompletedAction } from "../../actions/actionsUtils";

export const urbanZoneTypeCompleted = createStepCompletedAction<{ urbanZoneType: UrbanZoneType }>(
  "URBAN_ZONE_TYPE",
);
