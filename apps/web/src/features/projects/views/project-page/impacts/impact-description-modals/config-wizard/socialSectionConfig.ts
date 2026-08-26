import { lazy } from "react";

import { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import { formatETPImpact } from "@/features/projects/views/shared/formatImpactValue";
import { SocialSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import { ContentComponentType, ModalImpactConfig } from "./config.type";

const SOCIAL_METRICS_MODALS = {
  social: {
    title: "Impacts sociaux",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/social_section.mdx"),
    ),
  },
  "social.jobs": {
    title: "Impacts sur l'emploi",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/social_jobs_section.mdx"),
    ),
  },
  "social.localPeopleOrCompany": undefined,
  "social.humanity": undefined,

  avoidedFricheAccidents: undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsDeaths": undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsMinorInjuries": undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsSevereInjuries": undefined,
  avoidedTrafficAccidents: {
    title: "🚘 Personnes préservées des accidents de la route",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/avoided-accidents/avoided_traffic_accidents.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsDeaths": {
    title: "🪦 Décès évités",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("../mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_deaths.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsMinorInjuries": {
    title: "🤕 Blessés légers évités",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("../mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_minor_injuries.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsSevereInjuries": {
    title: "🚑 Blessés graves évités",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("../mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_severe_injuries.mdx"),
    ),
  },
  avoidedVehiculeKilometers: {
    title: "🚙 Kilomètres évités",
    description: "pour la population locale",
    unit: "kms",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/avoided_vehicule_kilometers.mdx"),
    ),
  },
  fullTimeJobs: {
    title: "🧑‍🔧 Emplois équivalent temps plein",
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/full-time-jobs/full_time_jobs.mdx"),
    ),
  },
  "fullTimeJobs.conversionFullTimeJobs": {
    title: "👷 Reconversion du site",
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/full-time-jobs/full_time_jobs__reconversion.mdx"),
    ),
  },
  "fullTimeJobs.photovoltaicOperationsFullTimeJobs": {
    title: "🧑‍🔧 Exploitation du site",
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/full-time-jobs/full_time_jobs__operations_pv.mdx"),
    ),
  },
  "fullTimeJobs.urbanOperationsFullTimeJobs": {
    title: "🧑‍🔧 Exploitation du site",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/full-time-jobs/full_time_jobs__operations_urban.mdx"),
    ),
  },
  householdsPoweredByRenewableEnergy: {
    title: "🏠 Foyers alimentés par les EnR",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/households_powered_by_enr.mdx"),
    ),
  },
  timeTravelSavedInHours: {
    title: "⏱️ Temps passé en moins dans les transports",
    unit: "h",
    description: "pour la population locale",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/travel_time_saved.mdx"),
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
