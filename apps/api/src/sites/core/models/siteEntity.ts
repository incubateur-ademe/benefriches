import type { SiteCreationMode } from "shared";

import type { Site } from "./site";

export type SiteEntity = Site & {
  createdAt: Date;
  createdBy: string;
  creationMode: SiteCreationMode;
  status: "active" | "archived";
  updatedAt?: Date;
};
