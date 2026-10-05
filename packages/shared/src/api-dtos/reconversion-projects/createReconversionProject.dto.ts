import type z from "zod";

import { httpSaveReconversionProjectPropsSchema } from "../../reconversion-projects/reconversionProjectSchemas";

// No createdBy: the API takes the author from the access token, never from the body.
export const createReconversionProjectRequestDtoSchema =
  httpSaveReconversionProjectPropsSchema.omit({
    createdBy: true,
  });

export type CreateReconversionProjectRequestDto = z.infer<
  typeof createReconversionProjectRequestDtoSchema
>;
