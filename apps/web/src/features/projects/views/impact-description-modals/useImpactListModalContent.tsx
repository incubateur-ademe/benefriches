import { lazy, useMemo } from "react";
import { formatCO2Impact, formatMonetaryImpact } from "shared";
import type { Link } from "type-route";

import type { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import type { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import type { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import type { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";

import type { ModalDataProps } from "../../application/project-impacts/selectors/projectImpacts.selectors";
import {
  formatDefaultImpact,
  formatETPImpact,
  formatSurfaceAreaImpact,
} from "../shared/formatImpactValue";
import {
  getEconomicBalanceImpactLabel,
  getEnvironmentalImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../shared/getImpactLabel";
import type { ContentState, UpdateModalContentArgs } from "./ImpactModalDescriptionContext";
import CostBenefitAnalysisModalChart from "./body-component/CostBenefitAnalysisModalChart";
import {
  getEconomicBalanceImpactColor,
  getEnvironmentalImpactColor,
  getSocialImpactColor,
  getSocioEconomicImpactColor,
} from "./colors";
import type { ContentComponentType, ModalImpactConfig } from "./config-wizard/config.type";
import { ECONOMIC_BALANCE_MODAL_CONFIG } from "./config-wizard/economicBalanceConfig";
import { ENVIRONMENTAL_METRICS_MODAL_CONFIG } from "./config-wizard/environmentalSectionConfig";
import { SOCIAL_METRICS_MODAL_CONFIG } from "./config-wizard/socialSectionConfig";
import { SOCIO_ECONOMIC_MODAL_CONFIG } from "./config-wizard/socioEconomicSectionConfig";
import { getImpactModalData, splitImpactKey } from "./getImpactData";
import type { ModalHeaderDataProps } from "./modal-layout/ModalHeader";

export const MODAL_CONFIG_GROUPS: {
  sections: readonly ContentState["sectionName"][];
  modals: Record<string, ModalImpactConfig>;
  formatFn: (val: number) => string;
  caption: string;
}[] = [
  ECONOMIC_BALANCE_MODAL_CONFIG,
  SOCIO_ECONOMIC_MODAL_CONFIG,
  SOCIAL_METRICS_MODAL_CONFIG,
  ENVIRONMENTAL_METRICS_MODAL_CONFIG,
];

const BREAK_EVEN_LEVEL_CONFIG: ModalImpactConfig = {
  dataProps: (p) => ({
    type: "custom",
    chart: <CostBenefitAnalysisModalChart impactsData={p.impactsData} />,
    headerProps: {},
    tableProps: {
      caption: "Bilan de l'opération et impacts socio-économiques",
      data: [
        {
          label: "📉 Bilan de l'opération",
          value: p.impactsData.projectEconomicBalance.total,
          color: "#E0A227",
          linkProps: p.getDetailsLink({ sectionName: "economicBalance" }),
        },
        {
          label: "🌍 Impacts socio-économiques",
          value: p.impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
          color: "#22AFE5",
          linkProps: p.getDetailsLink({ sectionName: "socioEconomic" }),
        },
      ],
    },
  }),
  ContentComponent: lazy<ContentComponentType>(
    () =>
      import("@/features/projects/views/impact-description-modals/mdx-component/cost-benefit-analysis.mdx"),
  ),
};

export default (
  contentState: ContentState,
  modalsData: ModalDataProps,
  getDetailsLink: (args: UpdateModalContentArgs) => Link | undefined,
) => {
  const config = useMemo(() => {
    if (!contentState.sectionName) {
      return undefined;
    }

    if (contentState.sectionName === "breakEvenLevel") {
      return BREAK_EVEN_LEVEL_CONFIG;
    }

    const group = MODAL_CONFIG_GROUPS.find((group) =>
      group.sections.includes(contentState.sectionName),
    );
    if (!group) return undefined;

    const key = contentState.impactDetailsName ?? contentState.sectionName;

    return {
      formatFn: group.formatFn,
      caption: group.caption,
      ...group.modals[key],
    };
  }, [contentState]);

  const dataProps: ModalHeaderDataProps | undefined = useMemo(() => {
    if (config?.dataProps) {
      return config.dataProps({ ...modalsData, getDetailsLink });
    }
    switch (contentState.sectionName) {
      case "socioEconomic":
      case "socioEconomic.humanity":
      case "socioEconomic.localPeopleOrCompany":
      case "socioEconomic.localAuthority": {
        const [_, subSection] = splitImpactKey(contentState.sectionName);
        return subSection && contentState.impactDetailsName
          ? getImpactModalData<SocioEconomicImpactImpactKeyName>(
              modalsData.economicImpactsByBearerAndCategory[subSection].impacts,
              contentState.impactDetailsName,
              {
                getLabel: getSocioEconomicImpactLabel,
                getColor: getSocioEconomicImpactColor,
                getLinkProps: (key) => getDetailsLink({ ...contentState, impactDetailsName: key }),
                formatFn: formatMonetaryImpact,
                description: config?.description,
                subtitle: config?.subtitle,
                caption: config?.caption,
              },
            )
          : undefined;
      }

      case "social":
      case "social.humanity":
      case "social.jobs":
      case "social.localPeopleOrCompany": {
        const [_, subSection] = splitImpactKey(contentState.sectionName);
        return subSection && contentState.impactDetailsName
          ? getImpactModalData<SocialImpactMetricKeyName>(
              modalsData.socialMetricsByCategory[subSection],
              contentState.impactDetailsName,
              {
                getLabel: getSocialImpactLabel,
                getColor: getSocialImpactColor,
                getLinkProps: (key) => getDetailsLink({ ...contentState, impactDetailsName: key }),
                formatFn: subSection === "jobs" ? formatETPImpact : formatDefaultImpact,
                unit: subSection === "jobs" ? "ETP" : "",
                description: config?.description,
                subtitle: config?.subtitle,
                caption: config?.caption,
              },
            )
          : undefined;
      }
      case "economicBalance":
        return contentState.impactDetailsName
          ? getImpactModalData<EconomicBalanceImpactKeyName>(
              modalsData.projectEconomicBalance.economicBalance,
              contentState.impactDetailsName,
              {
                getLabel: getEconomicBalanceImpactLabel,
                getColor: getEconomicBalanceImpactColor,
                getLinkProps: (key) => getDetailsLink({ ...contentState, impactDetailsName: key }),
                formatFn: formatMonetaryImpact,
                description: config?.description,
                subtitle: config?.subtitle,
                caption: config?.caption,
              },
            )
          : undefined;
      case "environmental":
      case "environmental.co2eq":
      case "environmental.soils": {
        const [_, subSection] = splitImpactKey(contentState.sectionName);

        return subSection && contentState.impactDetailsName
          ? getImpactModalData<EnvironmentalImpactMetricKeyName>(
              modalsData.environmentalMetricsByCategory[subSection],
              contentState.impactDetailsName,
              {
                getLabel: getEnvironmentalImpactLabel,
                getColor: getEnvironmentalImpactColor,
                getLinkProps: (key) => getDetailsLink({ ...contentState, impactDetailsName: key }),
                formatFn: subSection === "co2eq" ? formatCO2Impact : formatSurfaceAreaImpact,
                description: config?.description,
                subtitle: config?.subtitle,
                caption: config?.caption,
              },
            )
          : undefined;
      }
    }
  }, [config, contentState, modalsData, getDetailsLink]);

  if (!config) return undefined;

  return {
    dataProps,
    ContentComponent: config.ContentComponent,
  };
};
