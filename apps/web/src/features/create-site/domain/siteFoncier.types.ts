export enum SiteFoncierType {
  FRICHE = "FRICHE",
  NATURAL_AREA = "NATURAL_AREA",
}

export type SiteFoncier = {
  name: string;
  description: string;
  type: SiteFoncierType;
  address: string;
};
