import { lazy } from "react";

import type { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import { formatETPImpact } from "@/features/projects/views/shared/formatImpactValue";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import type { SocialSectionName } from "../ImpactModalDescriptionContext";
import type { ContentComponentType, ModalImpactConfig } from "./config.type";

const SOCIAL_METRICS_MODALS = {
  social: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/social_section.mdx"),
    ),
  },
  "social.jobs": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/social_jobs_section.mdx"),
    ),
  },
  "social.localPeopleOrCompany": undefined,
  "social.humanity": undefined,

  avoidedFricheAccidents: undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsDeaths": undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsMinorInjuries": undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsSevereInjuries": undefined,
  avoidedTrafficAccidents: {
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-accidents/avoided_traffic_accidents.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsDeaths": {
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_deaths.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsMinorInjuries": {
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_minor_injuries.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsSevereInjuries": {
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_severe_injuries.mdx"),
    ),
  },
  avoidedVehiculeKilometers: {
    description: "pour la population locale",
    unit: "kms",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided_vehicule_kilometers.mdx"),
    ),
  },
  fullTimeJobs: {
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/full-time-jobs/full_time_jobs.mdx"),
    ),
  },
  "fullTimeJobs.conversionFullTimeJobs": {
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/full-time-jobs/full_time_jobs__reconversion.mdx"),
    ),
  },
  "fullTimeJobs.photovoltaicOperationsFullTimeJobs": {
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/full-time-jobs/full_time_jobs__operations_pv.mdx"),
    ),
  },
  "fullTimeJobs.urbanOperationsFullTimeJobs": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/full-time-jobs/full_time_jobs__operations_urban.mdx"),
    ),
  },
  householdsPoweredByRenewableEnergy: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/households_powered_by_enr.mdx"),
    ),
  },
  timeTravelSavedInHours: {
    unit: "h",
    description: "pour la population locale",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/travel_time_saved.mdx"),
    ),
  },
} as const satisfies Record<SocialImpactMetricKeyName | SocialSectionName, ModalImpactConfig>;

export const SOCIAL_METRICS_MODAL_CONFIG = {
  sections: [
    "social",
    "social.humanity",
    "social.localPeopleOrCompany",
    "social.jobs",
  ] satisfies readonly SocialSectionName[],
  modals: SOCIAL_METRICS_MODALS,
  formatFn: formatNumberFr,
  caption: "Détails des impacts sociaux",
} as const;
