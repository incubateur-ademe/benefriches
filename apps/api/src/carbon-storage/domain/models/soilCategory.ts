import { z } from "zod";
import { ValueObject } from "src/shared-kernel/valueObject";
import { RepositorySoilCategoryType } from "./carbonStorage";

export enum SoilCategoryType {
  BUILDINGS = "BUILDINGS",
  IMPERMEABLE_SOILS = "IMPERMEABLE_SOILS",
  MINERAL_SOIL = "MINERAL_SOIL",
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED = "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  ARTIFICIAL_TREE_FILLED = "ARTIFICIAL_TREE_FILLED",
  FOREST_DECIDUOUS = "FOREST_DECIDUOUS",
  FOREST_CONIFER = "FOREST_CONIFER",
  FOREST_POPLAR = "FOREST_POPLAR",
  FOREST_MIXED = "FOREST_MIXED",
  PRAIRIE_GRASS = "PRAIRIE_GRASS",
  PRAIRIE_BUSHES = "PRAIRIE_BUSHES",
  PRAIRIE_TREES = "PRAIRIE_TREES",
  ORCHARD = "ORCHARD", // verger
  CULTIVATION = "CULTIVATION", // culture
  VINEYARD = "VINEYARD", // vigne
  WET_LAND = "WET_LAND", // zone humide
  WATER = "WATER", // plan d'eau
}

export class SoilCategory extends ValueObject<SoilCategoryType> {
  static create(value: SoilCategoryType) {
    return new SoilCategory(value);
  }

  validate(value: SoilCategoryType) {
    z.nativeEnum(SoilCategoryType).parse(value);
  }

  getValue(): SoilCategoryType {
    return this.value;
  }

  getRepositorySoilCategory(): RepositorySoilCategoryType {
    if (this.value === SoilCategoryType.BUILDINGS || this.value === SoilCategoryType.MINERAL_SOIL) {
      return SoilCategoryType.IMPERMEABLE_SOILS.toLowerCase() as RepositorySoilCategoryType;
    }

    return this.value.toLowerCase() as RepositorySoilCategoryType;
  }
}
