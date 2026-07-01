import { SoilType } from ".";

export type SoilsCarbonStorage = {
  total: number;
} & Partial<Record<SoilType, number>>;
