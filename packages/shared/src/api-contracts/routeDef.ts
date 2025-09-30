import z from "zod";

export type RouteDef = {
  path: string;
  bodySchema?: z.ZodType;
  querySchema?: z.ZodType;
};
