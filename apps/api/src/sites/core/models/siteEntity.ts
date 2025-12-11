import type { Site } from "./site";

export type SiteEntity = Site & {
  createdAt: Date;
  createdBy: string;
  creationMode: "express" | "custom" | "csv-import";
  status: "active" | "archived";
  updatedAt?: Date;
};
