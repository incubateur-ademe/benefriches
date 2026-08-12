import { Suspense, useContext, useMemo } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { groupEconomicBalanceByListViewCategory } from "@/features/projects/core/projectImpactsEconomicBalance";
import { groupSocialMetricsByListViewCategory } from "@/features/projects/core/projectImpactsSocial";
import { getSocioEconomicProjectImpactsGroupedByCategory } from "@/features/projects/core/projectImpactsSocioEconomic";
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
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../getImpactLabel";
import { getBreadcrumbProps } from "./breadcrumb";
import {
  getEconomicBalanceImpactColor,
  getSocialImpactColor,
  getSocioEconomicImpactColor,
} from "./colors";
import { ECONOMIC_BALANCE_MODALS } from "./economicBalanceConfig";
import { getImpactModalData } from "./getImpactData";
import ModalTable from "./shared/ModalTable";
import { LazyBodyComponent } from "./shared/lazy-component/LazyBodyComponent";
import { LazyContentComponent } from "./shared/lazy-component/LazyContentComponent";
import ModalColumnPointChart from "./shared/modal-charts/ModalColumnPointChart";
import { SOCIAL_METRICS_MODALS } from "./socialSectionConfig";
import { SOCIO_ECONOMIC_MODALS } from "./socioEconomicSectionConfig";

type Props = {
  contentState: Extract<
    ContentState,
    { sectionName: "socio_economic" | "social" | "economic_balance" }
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

  const impactMetricsByCategory = groupSocialMetricsByListViewCategory(
    aggregatedReconversionImpacts.impactsMetrics,
    contextData.projectDevelopmentPlan.type,
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
    }
  }, [contentState]);

  const data = useMemo(() => {
    switch (contentState.sectionName) {
      case "socio_economic":
        return contentState.subSectionName && contentState.impactName
          ? getImpactModalData(
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
          ? getImpactModalData(
              impactMetricsByCategory[contentState.subSectionName],
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
          ? getImpactModalData(
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
    }
  }, [
    contentState,
    indirectEconomicImpactsByBearerAndCategory,
    impactMetricsByCategory,
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
                  text: formatMonetaryImpact(data.total),
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
          {data?.details && (
            <ModalData>
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
              <ModalTable
                formatFn={config.formatFn}
                caption={config.caption}
                data={data?.details}
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
