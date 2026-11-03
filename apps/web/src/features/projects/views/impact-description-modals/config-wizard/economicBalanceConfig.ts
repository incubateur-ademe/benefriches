import { lazy } from "react";
import { roundTo2Digits, sumListWithKey } from "shared";

import type { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { getEconomicBalanceImpactLabel } from "../../shared/getImpactLabel";
import { getEconomicBalanceImpactColor } from "../colors";
import type { ContentComponentType, ModalImpactConfig } from "./config.type";

const ECONOMIC_BALANCE_MODALS = {
  economicBalance: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/index.mdx"),
    ),
    dataProps: (p) => {
      const impactList = p.projectEconomicBalance.economicBalance.map(
        ({ total, keyName: name }) => ({
          label: getEconomicBalanceImpactLabel(name),
          color: getEconomicBalanceImpactColor(name),
          value: roundTo2Digits(total),
          name,
          linkProps: p.getDetailsLink({
            sectionName: "economicBalance",
            impactDetailsName: name,
          }),
        }),
      );

      const incomes = impactList.filter(({ value }) => value > 0);
      const expenses = impactList.filter(({ value }) => value < 0);
      const data = [
        {
          label: "Dépenses",
          total: sumListWithKey(expenses, "value"),
          values: expenses,
        },
        {
          label: "Recettes",
          total: sumListWithKey(incomes, "value"),
          values: incomes,
        },
      ];

      return {
        type: "groupedColumn",
        headerProps: {
          value: {
            description: `pour ${p.projectEconomicBalance.bearerName}`,
            state: p.projectEconomicBalance.total > 0 ? "success" : "error",
            text: formatMonetaryImpact(p.projectEconomicBalance.total),
          },
        },
        chartProps: {
          format: "monetary",
          exportTitle: "📉 Bilan de l'opération",
          exportSubtitle: `pour ${p.projectEconomicBalance.bearerName}`,
          data: data,
        },
        tableProps: {
          caption: "Liste des dépenses et recettes liées au projet et au site",
          data: data,
        },
      };
    },
  },

  realEstateAcquisition: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/real_estate_acquisition.mdx"),
    ),
  },

  "realEstateAcquisition.sitePurchase": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/real_estate_acquisition-site_purchase.mdx"),
    ),
  },

  "realEstateAcquisition.siteResaleRevenue": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/real_estate_acquisition-site_resale.mdx"),
    ),
  },
  "realEstateAcquisition.buildingsResaleRevenue": undefined,

  siteReinstatement: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/site_reinstatement.mdx"),
    ),
  },
  "siteReinstatement.sustainable_soils_reinstatement": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/site_reinstatement-sustainable_soils_reinstatement.mdx"),
    ),
  },
  "siteReinstatement.deimpermeabilization": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/site_reinstatement-deimpermeabilization.mdx"),
    ),
  },
  "siteReinstatement.remediation": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/site_reinstatement-remediation.mdx"),
    ),
  },
  "siteReinstatement.demolition": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/site_reinstatement-demolition.mdx"),
    ),
  },
  "siteReinstatement.asbestos_removal": undefined,
  "siteReinstatement.waste_collection": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/site_reinstatement-waste_collection.mdx"),
    ),
  },
  "siteReinstatement.other_reinstatement": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/site_reinstatement-other_reinstatement.mdx"),
    ),
  },

  photovoltaicProjectInstallation: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/photovoltaic_development_plan_installation.mdx"),
    ),
  },
  "photovoltaicProjectInstallation.installation_works": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/photovoltaic_development_plan_installation.mdx"),
    ),
  },
  "photovoltaicProjectInstallation.technical_studies": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/photovoltaic_technical_studies.mdx"),
    ),
  },
  "photovoltaicProjectInstallation.other": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/photovoltaic_other.mdx"),
    ),
  },
  urbanProjectInstallation: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/urban_project_development_plan_installation.mdx"),
    ),
  },
  "urbanProjectInstallation.development_works": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/urban_project_works.mdx"),
    ),
  },
  "urbanProjectInstallation.technical_studies": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/urban_project_technical_studies.mdx"),
    ),
  },
  "urbanProjectInstallation.other": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/urban_project_other.mdx"),
    ),
  },

  projectBuildingsInstallation: undefined,
  "projectBuildingsInstallation.buildings_construction_works": undefined,
  "projectBuildingsInstallation.buildings_rehabilitation_works": undefined,
  "projectBuildingsInstallation.technical_studies_and_fees": undefined,
  "projectBuildingsInstallation.other_construction_expenses": undefined,

  financialAssistanceRevenues: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/financial_assistance.mdx"),
    ),
  },
  "financialAssistanceRevenues.public_subsidies": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/financial_assistance-public_subsidies.mdx"),
    ),
  },
  "financialAssistanceRevenues.local_or_regional_authority_participation": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/economic-balance/financial_assistance-local_or_regional_authority_participation.mdx"),
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
