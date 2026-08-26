import { lazy } from "react";

import { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { BodyComponentType, ContentComponentType, ModalImpactConfig } from "./config.type";

const ECONOMIC_BALANCE_MODALS = {
  economicBalance: {
    BodyComponent: lazy<BodyComponentType>(
      () => import("../body-component/EconomicBalanceDescription"),
    ),
  },

  realEstateAcquisition: {
    title: "🏠 Transaction foncière",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/real_estate_acquisition.mdx"),
    ),
  },

  "realEstateAcquisition.sitePurchase": {
    title: "🏠 Acquisition du site",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/real_estate_acquisition-site_purchase.mdx"),
    ),
  },

  "realEstateAcquisition.siteResaleRevenue": {
    title: "🚪 Cession du site",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/real_estate_acquisition-site_resale.mdx"),
    ),
  },
  "realEstateAcquisition.buildingsResaleRevenue": undefined,

  siteReinstatement: {
    title: "🚧 Remise en état de la friche",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/site_reinstatement.mdx"),
    ),
  },
  "siteReinstatement.sustainable_soils_reinstatement": {
    title: "🌱 Restauration écologique",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("../mdx-component/economic-balance/site_reinstatement-sustainable_soils_reinstatement.mdx"),
    ),
  },
  "siteReinstatement.deimpermeabilization": {
    title: "🌧️ Désimperméabilisation",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/site_reinstatement-deimpermeabilization.mdx"),
    ),
  },
  "siteReinstatement.remediation": {
    title: "✨ Dépollution des sols",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/site_reinstatement-remediation.mdx"),
    ),
  },
  "siteReinstatement.demolition": {
    title: "🧱 Déconstruction",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/site_reinstatement-demolition.mdx"),
    ),
  },
  "siteReinstatement.asbestos_removal": undefined,
  "siteReinstatement.waste_collection": {
    title: "♻️️ Évacuation et traitement des déchets",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/site_reinstatement-waste_collection.mdx"),
    ),
  },
  "siteReinstatement.other_reinstatement": {
    title: "🏗️ Autres dépenses de remise en état",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/site_reinstatement-other_reinstatement.mdx"),
    ),
  },

  photovoltaicProjectInstallation: {
    title: "⚡️ Installation de la centrale $EnR",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("../mdx-component/economic-balance/photovoltaic_development_plan_installation.mdx"),
    ),
  },
  "photovoltaicProjectInstallation.installation_works": {
    title: "🛠️ Travaux d'installation des panneaux",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("../mdx-component/economic-balance/photovoltaic_development_plan_installation.mdx"),
    ),
  },
  "photovoltaicProjectInstallation.technical_studies": {
    title: "📋 Études et honoraires techniques",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/photovoltaic_technical_studies.mdx"),
    ),
  },
  "photovoltaicProjectInstallation.other": {
    title: "⚡️ Autres frais d’installation de la centrale",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/photovoltaic_other.mdx"),
    ),
  },

  urbanProjectInstallation: {
    title: "🏘 Aménagement du site",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("../mdx-component/economic-balance/urban_project_development_plan_installation.mdx"),
    ),
  },
  "urbanProjectInstallation.development_works": {
    title: "🏗 Travaux d'aménagement",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/urban_project_works.mdx"),
    ),
  },
  "urbanProjectInstallation.technical_studies": {
    title: "📋 Études et honoraires techniques",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/urban_project_technical_studies.mdx"),
    ),
  },
  "urbanProjectInstallation.other": {
    title: "🏘 Autres dépenses d'aménagements",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/urban_project_other.mdx"),
    ),
  },

  projectBuildingsInstallation: undefined,
  "projectBuildingsInstallation.buildings_construction_works": undefined,
  "projectBuildingsInstallation.buildings_rehabilitation_works": undefined,
  "projectBuildingsInstallation.technical_studies_and_fees": undefined,
  "projectBuildingsInstallation.other_construction_expenses": undefined,

  financialAssistanceRevenues: {
    title: "🏦 Aides financières",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/financial_assistance.mdx"),
    ),
  },
  "financialAssistanceRevenues.public_subsidies": {
    title: "🏫 Subventions publiques",
    ContentComponent: lazy<ContentComponentType>(
      () => import("../mdx-component/economic-balance/financial_assistance-public_subsidies.mdx"),
    ),
  },
  "financialAssistanceRevenues.local_or_regional_authority_participation": {
    title: "🏦 Participation des collectivités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("../mdx-component/economic-balance/financial_assistance-local_or_regional_authority_participation.mdx"),
    ),
  },
  "financialAssistanceRevenues.other": undefined,

  "urbanProjectInstallation.installation_works": undefined,
  projectOperatingRevenues: undefined,
  projectOperatingExpenses: undefined,
  "projectOperatingRevenues.other": undefined,
  "projectOperatingRevenues.operations": undefined,
  "projectOperatingRevenues.rent": undefined,
  "projectOperatingExpenses.other": undefined,
  "projectOperatingExpenses.rent": undefined,
  "projectOperatingExpenses.maintenance": undefined,
  "projectOperatingExpenses.taxes": undefined,
  "photovoltaicProjectInstallation.development_works": undefined,
} as const satisfies Record<EconomicBalanceImpactKeyName | "economicBalance", ModalImpactConfig>;

export const ECONOMIC_BALANCE_MODAL_CONFIG = {
  sections: ["economicBalance"],
  modals: ECONOMIC_BALANCE_MODALS,
  formatFn: formatMonetaryImpact,
  caption: "Liste des recettes et dépenses",
} as const;
