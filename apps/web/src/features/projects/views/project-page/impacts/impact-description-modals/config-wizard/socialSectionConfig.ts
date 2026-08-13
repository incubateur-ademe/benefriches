import { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import { formatETPImpact } from "@/features/projects/views/shared/formatImpactValue";
import { SocialSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { ModalImpactConfig } from "./config.type";

export const SOCIAL_METRICS_MODALS = {
  social: {
    title: "Impacts sociaux",
    ContentComponent: () => import("../mdx/social_section.mdx"),
  },
  jobs: {
    title: "Impacts sur l'emploi",
    ContentComponent: () => import("../mdx/social_jobs_section.mdx"),
  },
  localPeopleOrCompany: undefined,
  humanity: undefined,

  avoidedFricheAccidents: undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsDeaths": undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsMinorInjuries": undefined,
  "avoidedFricheAccidents.avoidedFricheAccidentsSevereInjuries": undefined,
  avoidedTrafficAccidents: {
    title: "🚘 Personnes préservées des accidents de la route",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: () => import("../mdx/avoided-accidents/avoided_traffic_accidents.mdx"),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsDeaths": {
    title: "🪦 Décès évités",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: () =>
      import("../mdx/avoided-accidents/avoided_traffic_accidents__avoided_accidents_deaths.mdx"),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsMinorInjuries": {
    title: "🤕 Blessés légers évités",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: () =>
      import("../mdx/avoided-accidents/avoided_traffic_accidents__avoided_accidents_minor_injuries.mdx"),
  },
  "avoidedTrafficAccidents.avoidedTrafficAccidentsSevereInjuries": {
    title: "🚑 Blessés graves évités",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: () =>
      import("../mdx/avoided-accidents/avoided_traffic_accidents__avoided_accidents_severe_injuries.mdx"),
  },
  avoidedVehiculeKilometers: {
    title: "🚙 Kilomètres évités",
    description: "pour la population locale",
    unit: "kms",
    ContentComponent: () => import("../mdx/avoided_vehicule_kilometers.mdx"),
  },
  fullTimeJobs: {
    title: "🧑‍🔧 Emplois équivalent temps plein",
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: () => import("../mdx/full-time-jobs/full_time_jobs.mdx"),
  },
  "fullTimeJobs.conversionFullTimeJobs": {
    title: "👷 Reconversion du site",
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: () => import("../mdx/full-time-jobs/full_time_jobs__reconversion.mdx"),
  },
  "fullTimeJobs.photovoltaicOperationsFullTimeJobs": {
    title: "🧑‍🔧 Exploitation du site",
    type: "etp",
    formatFn: formatETPImpact,
    ContentComponent: () => import("../mdx/full-time-jobs/full_time_jobs__operations_pv.mdx"),
  },
  "fullTimeJobs.urbanOperationsFullTimeJobs": {
    title: "🧑‍🔧 Exploitation du site",
    ContentComponent: () => import("../mdx/full-time-jobs/full_time_jobs__operations_urban.mdx"),
  },
  householdsPoweredByRenewableEnergy: {
    title: "🏠 Foyers alimentés par les EnR",
    ContentComponent: () => import("../mdx/households_powered_by_enr.mdx"),
  },
  timeTravelSavedInHours: {
    title: "⏱️ Temps passé en moins dans les transports",
    unit: "h",
    description: "pour la population locale",
    ContentComponent: () => import("../mdx/travel_time_saved.mdx"),
  },
} as const satisfies Record<
  SocialImpactMetricKeyName | SocialSubSectionName | "social",
  ModalImpactConfig
>;
