import { Site } from "shared";

export type SiteEntity = Site & {
  createdAt: Date;
  createdBy: string;
  creationMode: "express" | "custom" | "csv-import";
};
