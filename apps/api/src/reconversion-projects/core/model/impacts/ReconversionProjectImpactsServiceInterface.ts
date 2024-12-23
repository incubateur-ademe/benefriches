import {
  EnvironmentalCo2RelatedImpacts,
  EnvironmentalSoilsRelatedImpacts,
  ReconversionProjectImpacts,
  SocialImpacts,
  SocioEconomicImpact,
} from "shared";

export interface PartialImpactsServiceInterface {
  formatImpacts(): Partial<
    { socioEconomicList: SocioEconomicImpact[] } & SocialImpacts &
      EnvironmentalSoilsRelatedImpacts &
      EnvironmentalCo2RelatedImpacts
  >;
}

export interface ImpactsServiceInterface {
  formatImpacts(): Promise<ReconversionProjectImpacts>;
}
