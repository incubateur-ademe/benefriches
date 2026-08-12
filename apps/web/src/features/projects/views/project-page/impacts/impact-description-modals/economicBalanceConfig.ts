import { MDXComponents } from "mdx/types";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";

import { LazyContentComponent } from "./shared/lazy-component/LazyContentComponent";

export const ECONOMIC_BALANCE_MODALS = {
  economic_balance: {
    BodyComponent: () => import("./body-component/EconomicBalanceDescription"),
  },

  realEstateAcquisition: {
    title: "🏠 Transaction foncière",
    ContentComponent: () => import("./mdx/economic-balance/real_estate_acquisition.mdx"),
  },

  "realEstateAcquisition.sitePurchase": {
    title: "🏠 Acquisition du site",
    ContentComponent: () =>
      import("./mdx/economic-balance/real_estate_acquisition-site_purchase.mdx"),
  },

  "realEstateAcquisition.siteResaleRevenue": {
    title: "🚪 Cession du site",
    ContentComponent: () =>
      import("./mdx/economic-balance/real_estate_acquisition-site_resale.mdx"),
  },
  "realEstateAcquisition.buildingsResaleRevenue": undefined,

  siteReinstatement: {
    title: "🚧 Remise en état de la friche",
    ContentComponent: () => import("./mdx/economic-balance/site_reinstatement.mdx"),
  },
  "siteReinstatement.sustainable_soils_reinstatement": {
    title: "🌱 Restauration écologique",
    ContentComponent: () =>
      import("./mdx/economic-balance/site_reinstatement-sustainable_soils_reinstatement.mdx"),
  },
  "siteReinstatement.deimpermeabilization": {
    title: "🌧️ Désimperméabilisation",
    ContentComponent: () =>
      import("./mdx/economic-balance/site_reinstatement-deimpermeabilization.mdx"),
  },
  "siteReinstatement.remediation": {
    title: "✨ Dépollution des sols",
    ContentComponent: () => import("./mdx/economic-balance/site_reinstatement-remediation.mdx"),
  },
  "siteReinstatement.demolition": {
    title: "🧱 Déconstruction",
    ContentComponent: () => import("./mdx/economic-balance/site_reinstatement-demolition.mdx"),
  },
  "siteReinstatement.asbestos_removal": undefined,
  "siteReinstatement.waste_collection": {
    title: "♻️️ Évacuation et traitement des déchets",
    ContentComponent: () =>
      import("./mdx/economic-balance/site_reinstatement-waste_collection.mdx"),
  },
  "siteReinstatement.other_reinstatement": {
    title: "🏗️ Autres dépenses de remise en état",
    ContentComponent: () =>
      import("./mdx/economic-balance/site_reinstatement-other_reinstatement.mdx"),
  },

  photovoltaicProjectInstallation: {
    title: "⚡️ Installation de la centrale $EnR",
    ContentComponent: () =>
      import("./mdx/economic-balance/photovoltaic_development_plan_installation.mdx"),
  },
  "photovoltaicProjectInstallation.installation_works": {
    title: "🛠️ Travaux d'installation des panneaux",
    ContentComponent: () =>
      import("./mdx/economic-balance/photovoltaic_development_plan_installation.mdx"),
  },
  "photovoltaicProjectInstallation.technical_studies": {
    title: "📋 Études et honoraires techniques",
    ContentComponent: () => import("./mdx/economic-balance/photovoltaic_technical_studies.mdx"),
  },
  "photovoltaicProjectInstallation.other": {
    title: "⚡️ Autres frais d’installation de la centrale",
    ContentComponent: () => import("./mdx/economic-balance/photovoltaic_other.mdx"),
  },

  urbanProjectInstallation: {
    title: "🏘 Aménagement du site",
    ContentComponent: () =>
      import("./mdx/economic-balance/urban_project_development_plan_installation.mdx"),
  },
  "urbanProjectInstallation.development_works": {
    title: "🏗 Travaux d'aménagement",
    ContentComponent: () => import("./mdx/economic-balance/urban_project_works.mdx"),
  },
  "urbanProjectInstallation.technical_studies": {
    title: "📋 Études et honoraires techniques",
    ContentComponent: () => import("./mdx/economic-balance/urban_project_technical_studies.mdx"),
  },
  "urbanProjectInstallation.other": {
    title: "🏘 Autres dépenses d'aménagements",
    ContentComponent: () => import("./mdx/economic-balance/urban_project_other.mdx"),
  },

  projectBuildingsInstallation: undefined,
  "projectBuildingsInstallation.buildings_construction_works": undefined,
  "projectBuildingsInstallation.buildings_rehabilitation_works": undefined,
  "projectBuildingsInstallation.technical_studies_and_fees": undefined,
  "projectBuildingsInstallation.other_construction_expenses": undefined,

  financialAssistanceRevenues: {
    title: "🏦 Aides financière",
    ContentComponent: () => import("./mdx/economic-balance/financial_assistance.mdx"),
  },
  "financialAssistanceRevenues.public_subsidies": {
    title: "🏫 Subventions publiques",
    ContentComponent: () =>
      import("./mdx/economic-balance/financial_assistance-public_subsidies.mdx"),
  },
  "financialAssistanceRevenues.local_or_regional_authority_participation": {
    title: "🏦 Participation des collectivités",
    ContentComponent: () =>
      import("./mdx/economic-balance/financial_assistance-local_or_regional_authority_participation.mdx"),
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
} as const satisfies Record<
  EconomicBalanceImpactKeyName | "economic_balance",
  | {
      title: string;
      ContentComponent: LazyContentComponent;
    }
  | {
      BodyComponent: () => Promise<{
        default: React.ComponentType<{
          components?: MDXComponents;
          impactsData: ModalDataProps["impactsData"];
          contextData: ModalDataProps["contextData"];
        }>;
      }>;
    }
  | undefined
>;
