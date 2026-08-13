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
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ImpactInProgressDescriptionModal from "@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal";
import {
  ContentState,
  ImpactModalDescriptionContext,
} from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
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
import { ECONOMIC_BALANCE_MODALS } from "./config-wizard/economicBalanceConfig";
import { ENVIRONMENTAL_METRICS_MODALS } from "./config-wizard/environmentalSectionConfig";
import { SOCIAL_METRICS_MODALS } from "./config-wizard/socialSectionConfig";
import { SOCIO_ECONOMIC_MODALS } from "./config-wizard/socioEconomicSectionConfig";
import { getImpactModalData } from "./getImpactData";
import { LazyBodyComponent } from "./lazy-component/LazyBodyComponent";
import { LazyContentComponent } from "./lazy-component/LazyContentComponent";
import ModalAreaChart from "./modal-charts/ModalAreaChart";
import ModalColumnPointChart from "./modal-charts/ModalColumnPointChart";
import ModalTable from "./modal-table/ModalTable";

type Props = {
  contentState: Extract<
    ContentState,
    { sectionName: "socio_economic" | "social" | "economic_balance" | "environmental" }
  >;
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
};

const getInProgressTitle = (contentState: Props["contentState"]) => {
  if (contentState.sectionName === "socio_economic") {
    if (contentState.impactDetailsName)
      return getSocioEconomicImpactLabel(contentState.impactDetailsName);
    if (contentState.impactName) return getSocioEconomicImpactLabel(contentState.impactName);
  }

  if (contentState.sectionName === "economic_balance") {
    if (contentState.impactDetailsName)
      return getEconomicBalanceImpactLabel(contentState.impactDetailsName);
    if (contentState.impactName) return getEconomicBalanceImpactLabel(contentState.impactName);
  }

  if (contentState.sectionName === "social") {
    if (contentState.impactDetailsName) return getSocialImpactLabel(contentState.impactDetailsName);
    if (contentState.impactName) return getSocialImpactLabel(contentState.impactName);
    if (contentState.subSectionName === "humanity")
      return "Impacts sociaux pour la société française";
    if (contentState.subSectionName === "localPeopleOrCompany")
      return "Impacts sociaux pour les riverains";
  }
  return "En cours de rédaction...";
};

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

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const breadcrumbProps = useMemo(() => getBreadcrumbProps(contentState), [contentState]);

  const config = useMemo(() => {
    switch (contentState.sectionName) {
      case "socio_economic":
        return {
          formatFn: formatMonetaryImpact,
          caption: "Liste des impacts monétaires positifs et négatifs",
          ...SOCIO_ECONOMIC_MODALS[
            contentState.impactDetailsName ??
              contentState.impactName ??
              contentState.subSectionName ??
              contentState.sectionName
          ],
        };
      case "social":
        return {
          formatFn: formatNumberFr,
          caption: `Détails des impacts sociaux`,
          ...SOCIAL_METRICS_MODALS[
            contentState.impactDetailsName ??
              contentState.impactName ??
              contentState.subSectionName ??
              contentState.sectionName
          ],
        };
      case "economic_balance":
        return {
          formatFn: formatMonetaryImpact,
          caption: `Liste des recettes et dépenses`,
          ...ECONOMIC_BALANCE_MODALS[
            contentState.impactDetailsName ?? contentState.impactName ?? contentState.sectionName
          ],
        };
      case "environmental":
        return {
          formatFn: formatNumberFr,
          caption: `Liste des impacts environmentaux`,
          ...ENVIRONMENTAL_METRICS_MODALS[
            contentState.impactDetailsName ?? contentState.impactName ?? contentState.sectionName
          ],
        };
    }
  }, [contentState]);

  const data = useMemo(() => {
    switch (contentState.sectionName) {
      case "socio_economic":
        return contentState.subSectionName && contentState.impactName
          ? getImpactModalData<SocioEconomicImpactImpactKeyName>(
              indirectEconomicImpactsByBearerAndCategory[contentState.subSectionName].impacts,
              contentState.impactDetailsName ?? contentState.impactName,
              {
                getLabel: getSocioEconomicImpactLabel,
                getColor: getSocioEconomicImpactColor,
                onClick: (key) => {
                  updateModalContent({ ...contentState, impactDetailsName: key });
                },
              },
            )
          : undefined;

      case "social":
        return contentState.subSectionName && contentState.impactName
          ? getImpactModalData<SocialImpactMetricKeyName>(
              impactSocialMetricsByCategory[contentState.subSectionName],
              contentState.impactDetailsName ?? contentState.impactName,
              {
                getLabel: getSocialImpactLabel,
                getColor: getSocialImpactColor,
                onClick: (key) => {
                  updateModalContent({ ...contentState, impactDetailsName: key });
                },
              },
            )
          : undefined;
      case "economic_balance":
        return contentState.impactName
          ? getImpactModalData<EconomicBalanceImpactKeyName>(
              projectEconomicBalance,
              contentState.impactDetailsName ?? contentState.impactName,
              {
                getLabel: getEconomicBalanceImpactLabel,
                getColor: getEconomicBalanceImpactColor,
                onClick: (key) => {
                  updateModalContent({ ...contentState, impactDetailsName: key });
                },
              },
            )
          : undefined;
      case "environmental":
        return contentState.subSectionName && contentState.impactName
          ? getImpactModalData<EnvironmentalImpactMetricKeyName>(
              impactEnvironmentalMetricsByCategory[contentState.subSectionName],
              contentState.impactDetailsName ?? contentState.impactName,
              {
                getLabel: getEnvironmentalImpactLabel,
                getColor: getEnvironmentalImpactColor,
                onClick: (key) => {
                  updateModalContent({ ...contentState, impactDetailsName: key });
                },
              },
            )
          : undefined;
    }
  }, [
    contentState,
    indirectEconomicImpactsByBearerAndCategory,
    impactSocialMetricsByCategory,
    impactEnvironmentalMetricsByCategory,
    projectEconomicBalance,
    updateModalContent,
  ]);

  if (!("BodyComponent" in config) && !("ContentComponent" in config)) {
    return (
      <ImpactInProgressDescriptionModal
        title={getInProgressTitle(contentState)}
        breadcrumbProps={{
          section: breadcrumbProps.section,
          segments: breadcrumbProps.segments.slice(0, -1),
        }}
      />
    );
  }

  if ("BodyComponent" in config) {
    return (
      <LazyBodyComponent
        Component={config.BodyComponent}
        impactsData={impactsData}
        contextData={contextData}
      />
    );
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
                    contentState.sectionName === "socio_economic" ||
                    contentState.sectionName === "economic_balance"
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
                contentState.sectionName === "socio_economic" ||
                contentState.sectionName === "economic_balance"
              }
              Component={config.ContentComponent}
            />
          </ModalContent>
        </ModalGrid>
      </ModalBody>
    </Suspense>
  );
}
