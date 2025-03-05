import { ZodTypeAny } from "zod";

export type RouteDef = {
  path: string;
  bodySchema?: ZodTypeAny;
  querySchema?: ZodTypeAny;
};
