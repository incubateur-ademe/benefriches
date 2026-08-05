import type { MDXComponents } from "mdx/types";
import { lazy, useMemo } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import LinkToAvoidedKilometersImpact from "../avoided-kilometers-social-impact-link/AvoidedKilometersSocialImpactLink";
import ModalProjectFeature from "../features/ModalProjectFeature";
import ModalSiteFeature from "../features/ModalSiteFeature";

type ComponentType = React.ComponentType<{
  components?: MDXComponents;
  withMonetarisation?: boolean;
  isUrban?: boolean;
  isPhotovoltaic?: boolean;
}>;

export type LazyContentComponent = () => Promise<{
  default: ComponentType;
}>;

type Props = {
  contextData: ModalDataProps["contextData"];
  impactsData: ModalDataProps["impactsData"];
  Component: LazyContentComponent;
  withMonetarisation?: boolean;
};

function bindProps<P extends object, K extends keyof P>(
  Component: React.ComponentType<P>,
  boundProps: Pick<P, K>,
) {
  return (props: Omit<P, K>) => <Component {...(boundProps as P)} {...(props as P)} />;
}

const If = ({ when, children }: { when: boolean; children: React.ReactNode }) =>
  when ? children : null;

export function LazyContent({
  Component,
  withMonetarisation = false,
  impactsData,
  contextData,
}: Props) {
  const LazyComponent = useMemo(() => lazy<ComponentType>(Component), [Component]);

  const siteContaminatedSurfaceArea =
    impactsData.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
      (item) => item.name === "contaminatedSurface",
    )?.total;

  const BoundSiteFeature = useMemo(
    () =>
      bindProps(ModalSiteFeature, {
        siteSurfaceArea: contextData.siteSurfaceArea,
        contaminatedSurfaceArea:
          impactsData.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
            (item) => item.name === "contaminatedSurface",
          )?.total,
        siteAddress: contextData.siteAddress.label,
        soilsDistribution:
          impactsData.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.filter(
            (item) => item.name === "soilsDistribution",
          ),
      }),
    [contextData, impactsData],
  );

  const BoundProjectFeature = useMemo(
    () =>
      bindProps(ModalProjectFeature, {
        soilsDistribution:
          impactsData.reconversionImpactsBreakdown.projectIndirectImpactMetrics.filter(
            (item) => item.name === "soilsDistribution",
          ),
        siteContaminatedSurfaceArea,
        decontaminatedSurfaceArea:
          impactsData.reconversionImpactsBreakdown.projectIndirectImpactMetrics.find(
            (item) => item.name === "decontaminatedSurface",
          )?.total,
        projectDevelopmentPlan: contextData.projectDevelopmentPlan,
      }),
    [impactsData, contextData, siteContaminatedSurfaceArea],
  );

  return (
    <LazyComponent
      withMonetarisation={withMonetarisation}
      isUrban={contextData.projectDevelopmentPlan.type === "URBAN_PROJECT"}
      isPhotovoltaic={contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"}
      components={{
        a: ExternalLink,
        h2: ModalTitleTwo,
        h3: ModalTitleThree,
        SiteFeature: BoundSiteFeature,
        ProjectFeature: BoundProjectFeature,
        LinkToAvoidedKilometersImpact: LinkToAvoidedKilometersImpact,
        If,
      }}
    />
  );
}
