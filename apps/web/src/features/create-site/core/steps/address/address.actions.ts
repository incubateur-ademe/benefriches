import { Address } from "shared";

import { createStepCompletedAction } from "../../actions/actionsUtils";

export const addressStepCompleted = createStepCompletedAction<{ address: Address }>("ADDRESS");
