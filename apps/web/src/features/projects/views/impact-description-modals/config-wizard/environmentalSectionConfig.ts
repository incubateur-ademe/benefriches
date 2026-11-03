import { lazy } from "react";

import type { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import {
  formatCO2Impact,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import type { EnvironmentalSectionName } from "../ImpactModalDescriptionContext";
import type { ContentComponentType, ModalImpactConfig } from "./config.type";

const ENVIRONMENTAL_METRICS_MODALS = {
  environmental: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/environmental_section.mdx"),
    ),
  },
  "environmental.co2eq": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/environmental_co2_section.mdx"),
    ),
  },
  "environmental.soils": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/environmental_soils_section.mdx"),
    ),
  },

  avoidedCo2eqEmissions: {
    type: "co2",
    formatFn: formatCO2Impact,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-co2eq-emissions/avoided_co2eq_emissions.mdx"),
    ),
  },
  "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions": {
    type: "co2",
    formatFn: formatCO2Impact,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_air_conditioning_co2eq_emissions.mdx"),
    ),
  },
  "avoidedCo2eqEmissions.avoidedCO2TonsWithEnergyProduction": {
    type: "co2",
    formatFn: formatCO2Impact,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_co2eq_with_energy_production.mdx"),
    ),
  },
  "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions": {
    type: "co2",
    formatFn: formatCO2Impact,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_traffic_co2_eq_emissions.mdx"),
    ),
  },
  "avoidedCo2eqEmissions.newStoredCo2Eq": {
    type: "co2",
    formatFn: formatCO2Impact,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__new_stored_co2_eq.mdx"),
    ),
  },
  newPermeableSurface: {
    type: "surface_area",
    formatFn: formatSurfaceAreaImpact,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/new_permeable_surface.mdx"),
    ),
  },
  "newPermeableSurface.newPermeableGreenSurface": {
    type: "surface_area",
    formatFn: formatSurfaceAreaImpact,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/new_permeable_surface__green_surface.mdx"),
    ),
  },
  "newPermeableSurface.newPermeableMineralSurface": {
    formatFn: formatSurfaceAreaImpact,

    type: "surface_area",

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/new_permeable_surface__mineral_surface.mdx"),
    ),
  },
  nonContaminatedSurfaceArea: {
    type: "surface_area",
    formatFn: formatSurfaceAreaImpact,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/non_contaminated_surface.mdx"),
    ),
  },
} as const satisfies Record<
  EnvironmentalImpactMetricKeyName | EnvironmentalSectionName,
  ModalImpactConfig
>;

export const ENVIRONMENTAL_METRICS_MODAL_CONFIG = {
  sections: [
    "environmental",
    "environmental.soils",
    "environmental.co2eq",
  ] satisfies readonly EnvironmentalSectionName[],
  modals: ENVIRONMENTAL_METRICS_MODALS,
  formatFn: formatNumberFr,
  caption: "Liste des impacts environmentaux",
} as const;
