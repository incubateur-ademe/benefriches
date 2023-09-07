export enum SiteFoncierType {
  FRICHE = "friche",
  TERRE_AGRICOLE = "terre agricole",
  PRAIRIE = "prairie",
  FORET = "forêt",
}

export type SiteFoncier = {
  name: string;
  description: string;
  type: SiteFoncierType;
  address: string;
};
