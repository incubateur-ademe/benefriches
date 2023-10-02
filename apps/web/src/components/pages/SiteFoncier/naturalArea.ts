import { SiteFoncier, SiteFoncierType } from "./siteFoncier";

export type NaturalArea = SiteFoncier & {
  type: SiteFoncierType.NATURAL_AREA;
  spaces: NaturalAreaSpace[];
  owners: Owner[];
  operatingCompanyName?: string;
  operationStatus: OperationStatus;
  fullTimeJobsInvolvedCount: number;
  yearlyOperationExpenses: {
    rent: number;
    taxes: number;
    otherExpenses: number;
  };
  yearlyOperationIncome: {
    operations: number;
    other: number;
  };
};

export enum NaturalAreaSpaceType {
  ORCHARD = "ORCHARD", // verger
  CULTIVATION = "CULTIVATION", // culture
  VINEYARD = "VINEYARD", // vigne
  PRAIRIE = "PRAIRIE",
  FOREST = "FOREST",
  WET_LAND = "WET_LAND", // zone humide
  WATER = "WATER", // plan d'eau
}

export enum TreeType {
  DECIDUOUS = "DECIDUOUS", // feuillus
  RESINOUS = "RESINOUS",
  POPLAR = "POPLAR", // peupleraie
  MIXED = "MIXED",
}

export type Forest = {
  type: NaturalAreaSpaceType.FOREST;
  trees: { type: TreeType; surface?: number }[];
};

export enum VegetationType {
  GRASS = "GRASS",
  TREES = "TREES",
  BUSHES = "BUSHES",
}

export type Prairie = {
  type: NaturalAreaSpaceType.PRAIRIE;
  vegetation: { type: VegetationType; surface?: number }[];
};

type OtherSpace = Omit<
  NaturalAreaSpaceType,
  NaturalAreaSpaceType.FOREST | NaturalAreaSpaceType.PRAIRIE
>;

type NaturalAreaSpace =
  | Forest
  | Prairie
  | {
      type: OtherSpace;
      surface?: number;
    };

export enum OwnerType {
  AGRICULTURAL_COMPANY = "AGRICULTURAL_COMPANY",
  LOCAL_OR_REGIONAL_AUTHORITY = "LOCAL_OR_REGIONAL_AUTHORITY",
  OTHER = "OTHER",
}

export type AgriculturalCompany = {
  type: OwnerType.AGRICULTURAL_COMPANY;
  name: string;
};

export type Owner =
  | { type: OwnerType.LOCAL_OR_REGIONAL_AUTHORITY }
  | { type: OwnerType.OTHER; name: string }
  | AgriculturalCompany;

export enum OperationStatus {
  OPERATED_BY_OWNER = "OPERATED_BY_OWNER",
  OPERATED_BY_OTHER_COMPANY = "OPERATED_BY_OTHER_COMPANY",
  NOT_OPERATED = "NOT_OPERATED",
  UNKNOWN = "UNKNOWN",
}
