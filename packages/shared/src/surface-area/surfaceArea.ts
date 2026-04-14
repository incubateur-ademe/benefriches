import { z } from "zod";

/**
 * Zod schema for validating surface areas in square meters.
 * Accepts any non-negative number (>= 0).
 */
export const surfaceAreaSchema = z.number().nonnegative();

const SQUARE_METERS_PER_HECTARES = 10000;

export const convertSquareMetersToHectares = (surfaceAreaInSquareMeters: number) => {
  return surfaceAreaInSquareMeters / SQUARE_METERS_PER_HECTARES;
};

export const convertHectaresToSquareMeters = (surfaceAreaInHectares: number) => {
  return surfaceAreaInHectares * SQUARE_METERS_PER_HECTARES;
};
