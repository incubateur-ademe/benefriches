import {
  EnvironmentalCo2RelatedImpacts,
  EnvironmentalSoilsRelatedImpacts,
  SocialImpacts,
  SocioEconomicImpact,
} from "shared";

export interface ImpactServiceInterface {
  formatImpact(): Partial<
    { socioEconomicList: SocioEconomicImpact[] } & SocialImpacts &
      EnvironmentalSoilsRelatedImpacts &
      EnvironmentalCo2RelatedImpacts
  >;
}
