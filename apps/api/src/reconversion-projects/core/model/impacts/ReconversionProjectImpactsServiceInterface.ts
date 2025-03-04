import {
  AvoidedCO2EqEmissions,
  EnvironmentalCo2RelatedImpacts,
  ReconversionProjectImpacts,
  SocialImpacts,
  SocioEconomicImpact,
} from "shared";

export interface PartialImpactsServiceInterface {
  getSocioEconomicList?: () => SocioEconomicImpact[];
  getAvoidedCo2EqEmissionsDetails?: () => AvoidedCO2EqEmissions["details"];
  getEnvironmentalImpacts?: () => Partial<EnvironmentalCo2RelatedImpacts>;
  getSocialImpacts?: () => Partial<SocialImpacts>;
}

export interface ImpactsServiceInterface {
  formatImpacts(): ReconversionProjectImpacts;
}
