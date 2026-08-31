import z from "zod";

import {
  agriculturalCustomSiteFieldsSchema,
  baseCustomSiteSchema,
  fricheCustomSiteFieldsSchema,
  naturalCustomSiteFieldsSchema,
  urbanZoneCustomSiteFieldsSchema,
} from "./createCustomSite.dto";

const baseUpdateSchema = baseCustomSiteSchema.omit({ createdBy: true, id: true });

const fricheCustomUpdateDtoSchema = baseUpdateSchema.extend(fricheCustomSiteFieldsSchema.shape);

const agriculturalCustomSiteUpdateDtoSchema = baseUpdateSchema.extend(
  agriculturalCustomSiteFieldsSchema.shape,
);

const naturalCustomSiteUpdateDtoSchema = baseUpdateSchema.extend(
  naturalCustomSiteFieldsSchema.shape,
);

const urbanZoneCustomSiteUpdateDtoSchema = baseUpdateSchema.extend(
  urbanZoneCustomSiteFieldsSchema.shape,
);

export const updateCustomSiteDtoSchema = z.discriminatedUnion("nature", [
  fricheCustomUpdateDtoSchema,
  agriculturalCustomSiteUpdateDtoSchema,
  naturalCustomSiteUpdateDtoSchema,
  urbanZoneCustomSiteUpdateDtoSchema,
]);

export type UpdateCustomSiteDto = z.infer<typeof updateCustomSiteDtoSchema>;
