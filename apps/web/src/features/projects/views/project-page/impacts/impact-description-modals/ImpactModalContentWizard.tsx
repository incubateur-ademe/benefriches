import { Suspense, useContext, useMemo } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import {
  EconomicBalanceImpactKeyName,
  groupEconomicBalanceByListViewCategory,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import {
  EnvironmentalImpactMetricKeyName,
  groupEnvironmentalMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsEnvironmental";
import {
  groupSocialMetricsByListViewCategory,
  SocialImpactMetricKeyName,
} from "@/features/projects/core/projectImpactsSocial";
import {
  getSocioEconomicProjectImpactsGroupedByCategory,
  SocioEconomicImpactImpactKeyName,
} from "@/features/projects/core/projectImpactsSocioEconomic";
import {
  ContentState,
  EnvironmentalSectionName,
  ImpactModalDescriptionContext,
  SocialSectionName,
  SocioEconomicSectionName,
} from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  getEconomicBalanceImpactLabel,
  getEnvironmentalImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../getImpactLabel";
import { getBreadcrumbProps } from "./breadcrumb";
import {
  getEconomicBalanceImpactColor,
  getEnvironmentalImpactColor,
  getSocialImpactColor,
  getSocioEconomicImpactColor,
} from "./colors";
import { ModalImpactConfig } from "./config-wizard/config.type";
import { ECONOMIC_BALANCE_MODAL_CONFIG } from "./config-wizard/economicBalanceConfig";
import { ENVIRONMENTAL_METRICS_MODAL_CONFIG } from "./config-wizard/environmentalSectionConfig";
import { SOCIAL_METRICS_MODAL_CONFIG } from "./config-wizard/socialSectionConfig";
import { SOCIO_ECONOMIC_MODAL_CONFIG } from "./config-wizard/socioEconomicSectionConfig";
import { getImpactModalData, splitImpactKey } from "./getImpactData";
import { LazyContentComponent } from "./lazy-component/LazyContentComponent";
import ModalAreaChart from "./modal-charts/ModalAreaChart";
import ModalColumnPointChart from "./modal-charts/ModalColumnPointChart";
import ModalTable from "./modal-table/ModalTable";

type Props = {
  contentState: Extract<
    ContentState,
    {
      sectionName:
        | SocioEconomicSectionName
        | "economicBalance"
        | EnvironmentalSectionName
        | SocialSectionName;
    }
  >;
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
};

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

export function ImpactModalContentWizard({ contentState, impactsData, contextData }: Props) {
  const { stakeholders, aggregatedReconversionImpacts } = impactsData;

  const indirectEconomicImpactsByBearerAndCategory =
    getSocioEconomicProjectImpactsGroupedByCategory(
      aggregatedReconversionImpacts.indirectEconomicImpacts,
      stakeholders,
    );

  const impactSocialMetricsByCategory = groupSocialMetricsByListViewCategory(
    aggregatedReconversionImpacts.impactsMetrics,
    contextData.projectDevelopmentPlan.type,
  );

  const impactEnvironmentalMetricsByCategory = groupEnvironmentalMetricsByListViewCategory(
    impactsData,
    contextData.siteSurfaceArea,
  );

  const projectEconomicBalance = groupEconomicBalanceByListViewCategory(
    contextData.projectDevelopmentPlan.type,
    impactsData.projectEconomicBalance.details,
  );

  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  const breadcrumbProps = useMemo(() => getBreadcrumbProps(contentState), [contentState]);

  const config = useMemo(() => {
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

  const data = useMemo(() => {
    switch (contentState.sectionName) {
      case "socioEconomic":
      case "socioEconomic.humanity":
      case "socioEconomic.localPeopleOrCompany":
      case "socioEconomic.localAuthority": {
        const [_, subSection] = splitImpactKey(contentState.sectionName);
        return subSection && contentState.impactDetailsName
          ? getImpactModalData<SocioEconomicImpactImpactKeyName>(
              indirectEconomicImpactsByBearerAndCategory[subSection].impacts,
              contentState.impactDetailsName,
              {
                getLabel: getSocioEconomicImpactLabel,
                getColor: getSocioEconomicImpactColor,
                getLinkProps: (key) => getDetailsLink({ ...contentState, impactDetailsName: key }),
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
              impactSocialMetricsByCategory[subSection],
              contentState.impactDetailsName,
              {
                getLabel: getSocialImpactLabel,
                getColor: getSocialImpactColor,
                getLinkProps: (key) => getDetailsLink({ ...contentState, impactDetailsName: key }),
              },
            )
          : undefined;
      }
      case "economicBalance":
        return contentState.impactDetailsName
          ? getImpactModalData<EconomicBalanceImpactKeyName>(
              projectEconomicBalance,
              contentState.impactDetailsName,
              {
                getLabel: getEconomicBalanceImpactLabel,
                getColor: getEconomicBalanceImpactColor,
                getLinkProps: (key) => getDetailsLink({ ...contentState, impactDetailsName: key }),
              },
            )
          : undefined;
      case "environmental":
      case "environmental.co2eq":
      case "environmental.soils": {
        const [_, subSection] = splitImpactKey(contentState.sectionName);

        return subSection && contentState.impactDetailsName
          ? getImpactModalData<EnvironmentalImpactMetricKeyName>(
              impactEnvironmentalMetricsByCategory[subSection],
              contentState.impactDetailsName,
              {
                getLabel: getEnvironmentalImpactLabel,
                getColor: getEnvironmentalImpactColor,
                getLinkProps: (key) => getDetailsLink({ ...contentState, impactDetailsName: key }),
              },
            )
          : undefined;
      }
    }
  }, [
    contentState,
    indirectEconomicImpactsByBearerAndCategory,
    impactSocialMetricsByCategory,
    impactEnvironmentalMetricsByCategory,
    projectEconomicBalance,
    getDetailsLink,
  ]);

  if (!config || !("BodyComponent" in config || "ContentComponent" in config)) {
    return null;
  }

  if ("BodyComponent" in config) {
    return <config.BodyComponent impactsData={impactsData} contextData={contextData} />;
  }

  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      <ModalBody size="large">
        <ModalHeader
          title={config.title}
          subtitle={"subtitle" in config ? config.subtitle : undefined}
          value={
            data?.total
              ? {
                  state: data.total > 0 ? "success" : "error",
                  text: `${config.formatFn(data.total)} ${"unit" in config ? config.unit : ""}`,
                  description:
                    "description" in config
                      ? config.description
                      : data.bearerName
                        ? `pour ${data.bearerName}`
                        : undefined,
                }
              : undefined
          }
          breadcrumbSegments={[breadcrumbProps.section, ...breadcrumbProps.segments]}
        />
        <ModalGrid>
          {(data?.details || data?.breakdown) && (
            <ModalData>
              {data.breakdown ? (
                <ModalAreaChart
                  type={"type" in config ? config.type : undefined}
                  base={data.breakdown.base}
                  forecast={data.breakdown.forecast}
                  difference={data.total}
                  title={config.title}
                  color={data.color}
                  details={data?.details?.map((item) => ({
                    ...item,
                    base: item.breakdown?.base ?? 0,
                    forecast: item.breakdown?.forecast ?? item.value,
                    difference: item.value,
                  }))}
                />
              ) : data?.details ? (
                <ModalColumnPointChart
                  format={
                    contentState.sectionName.startsWith("socioEconomic") ||
                    contentState.sectionName === "economicBalance"
                      ? "monetary"
                      : "default"
                  }
                  data={data.details}
                  exportTitle={config.title}
                  exportSubtitle={"subtitle" in config ? config.subtitle : undefined}
                />
              ) : undefined}
              <ModalTable
                formatFn={config.formatFn}
                caption={config.caption}
                data={
                  data?.details ?? [{ label: config.title, value: data.total, color: data.color }]
                }
              />
            </ModalData>
          )}
          <ModalContent>
            <LazyContentComponent
              contextData={contextData}
              impactsData={impactsData}
              withMonetarisation={
                contentState.sectionName.startsWith("socioEconomic") ||
                contentState.sectionName === "economicBalance"
              }
              Component={config.ContentComponent}
            />
          </ModalContent>
        </ModalGrid>
      </ModalBody>
    </Suspense>
  );
}
