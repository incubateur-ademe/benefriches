import { createAction } from "@reduxjs/toolkit";

export const projectRemovedFromList = createAction<{ siteId: string; projectId: string }>(
  `siteView/projectRemoved`,
);
