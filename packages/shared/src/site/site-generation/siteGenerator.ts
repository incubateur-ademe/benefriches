import { Address, Site } from "../site";

export type City = {
  name: string;
  cityCode: string;
  population: number;
};

export type SiteGenerationProps = {
  id: string;
  surfaceArea: number;
  address: Address;
  cityPopulation: number;
};

export interface SiteGenerator<TProps extends SiteGenerationProps> {
  fromSurfaceAreaAndLocalInformation(props: TProps): Site;
}
