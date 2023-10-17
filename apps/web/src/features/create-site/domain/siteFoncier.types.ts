export enum SiteFoncierType {
  FRICHE = "FRICHE",
  NATURAL_AREA = "NATURAL_AREA",
}

export type Address = {
  id: string;
  value: string;
  city: string;
  cityCode: string;
  postCode: string;
  streetNumber?: string;
  streetName?: string;
  long: number;
  lat: number;
};

export type SiteFoncier = {
  type: SiteFoncierType;
  address: Address;
};
