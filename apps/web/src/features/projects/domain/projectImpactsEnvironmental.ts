import { GetReconversionProjectImpactsResultDto } from "shared";

type ImpactValue = {
  base: number;
  forecast: number;
  difference: number;
};

export type EnvironmentalMainImpactName =
  | "non_contaminated_surface_area"
  | "permeable_surface_area"
  | "co2_benefit";

export type CO2BenefitDetails =
  | "stored_co2_eq"
  | "avoided_co2_eq_emissions_with_production"
  | "avoided_air_conditioning_co2_eq_emissions"
  | "avoided_car_traffic_co2_eq_emissions";

export type PermeableSoilsDetails = "mineral_soil" | "green_soil";

export type EnvironmentalImpactDetailsName = CO2BenefitDetails | PermeableSoilsDetails;

export type EnvironmentalImpact = {
  name: EnvironmentalMainImpactName;
  type: "surface_area" | "co2" | "default";
  impact: ImpactValue & {
    details?: {
      name: EnvironmentalImpactDetailsName;
      impact: ImpactValue;
    }[];
  };
};

const getOrCreateCo2Benefit = (result: EnvironmentalImpact[]): EnvironmentalImpact => {
  let co2Benefit = result.find((item) => item.name === "co2_benefit");
  if (!co2Benefit) {
    co2Benefit = {
      name: "co2_benefit",
      type: "co2",
      impact: { base: 0, forecast: 0, difference: 0, details: [] },
    };
    result.push(co2Benefit);
  }
  return co2Benefit;
};

const addCo2Detail = (
  result: EnvironmentalImpact[],
  detailName: CO2BenefitDetails,
  base: number,
  forecast: number,
  difference: number,
): void => {
  const co2Benefit = getOrCreateCo2Benefit(result);

  co2Benefit.impact.details?.push({
    name: detailName,
    impact: { base, forecast, difference },
  });

  co2Benefit.impact.base += base;
  co2Benefit.impact.forecast += forecast;
  co2Benefit.impact.difference += difference;
};

export const getEnvironmentalProjectImpacts = (
  impactsData: GetReconversionProjectImpactsResultDto["impacts"],
  siteSurfaceArea: number,
): EnvironmentalImpact[] => {
  if (!impactsData) return [];

  const { impactsMetrics } = impactsData.aggregatedReconversionImpacts;
  const { siteStatuQuoImpactMetrics } = impactsData.reconversionImpactsBreakdown;

  return impactsMetrics.reduce<EnvironmentalImpact[]>((result, impact) => {
    switch (impact.name) {
      case "newPermeableGreenSurface":
      case "newPermeableMineralSurface": {
        if (result.find(({ name }) => name === "permeable_surface_area")) {
          return result;
        }
        const baseGreen =
          siteStatuQuoImpactMetrics.find((item) => item.name === "permeableGreenSurface")?.total ??
          0;
        const baseMineral =
          siteStatuQuoImpactMetrics.find((item) => item.name === "permeableMineralSurface")
            ?.total ?? 0;

        const newPermeableGreenSurface =
          impact.name === "newPermeableGreenSurface"
            ? impact.total
            : (impactsMetrics.find((it) => it.name === "newPermeableGreenSurface")?.total ?? 0);
        const newPermeableMineralSurface =
          impact.name === "newPermeableMineralSurface"
            ? impact.total
            : (impactsMetrics.find((it) => it.name === "newPermeableMineralSurface")?.total ?? 0);

        result.push({
          name: "permeable_surface_area",
          type: "surface_area",
          impact: {
            base: baseMineral + baseGreen,
            forecast:
              baseMineral + newPermeableMineralSurface + baseGreen + newPermeableGreenSurface,
            difference: newPermeableGreenSurface + newPermeableMineralSurface,
            details: [
              {
                name: "mineral_soil",

                impact: {
                  base: baseMineral,
                  forecast: baseMineral + newPermeableMineralSurface,
                  difference: newPermeableMineralSurface,
                },
              },
              {
                name: "green_soil",
                impact: {
                  base: baseGreen,
                  forecast: baseGreen + newPermeableGreenSurface,
                  difference: newPermeableGreenSurface,
                },
              },
            ],
          },
        });
        return result;
      }

      case "newStoredCo2Eq": {
        const base =
          siteStatuQuoImpactMetrics.find((item) => item.name === "storedCo2Eq")?.total ?? 0;
        addCo2Detail(result, "stored_co2_eq", base, base + impact.total, impact.total);
        return result;
      }

      case "avoidedAirConditioningCo2eqEmissions":
        addCo2Detail(
          result,
          "avoided_air_conditioning_co2_eq_emissions",
          0,
          impact.total,
          impact.total,
        );
        return result;

      case "avoidedCO2TonsWithEnergyProduction":
        addCo2Detail(
          result,
          "avoided_co2_eq_emissions_with_production",
          0,
          impact.total,
          impact.total,
        );
        return result;

      case "avoidedTrafficCo2EqEmissions":
        addCo2Detail(result, "avoided_car_traffic_co2_eq_emissions", 0, impact.total, impact.total);
        return result;

      case "decontaminatedSurface": {
        const contaminated =
          siteStatuQuoImpactMetrics.find((item) => item.name === "contaminatedSurface")?.total ?? 0;
        result.push({
          name: "non_contaminated_surface_area",
          type: "surface_area",
          impact: {
            base: siteSurfaceArea - contaminated,
            forecast: siteSurfaceArea - contaminated + impact.total,
            difference: impact.total,
          },
        });
        return result;
      }

      default:
        return result;
    }
  }, []);
};
