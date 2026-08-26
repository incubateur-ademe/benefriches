import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import type { MDXComponents } from "mdx/types";
import { LazyExoticComponent, useContext, useMemo } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import classNames from "@/shared/views/clsx";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import { ContentComponentType } from "../config-wizard/config.type";
import ModalProjectFeature from "../modal-features/ModalProjectFeature";
import ModalSiteFeature from "../modal-features/ModalSiteFeature";
import ModalTitleThree from "../modal-layout/ModalTitleThree";
import ModalTitleTwo from "../modal-layout/ModalTitleTwo";

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
  Component: LazyExoticComponent<ContentComponentType>;
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

export function LazyContentComponent({
  Component: LazyComponent,
  withMonetarisation = false,
  impactsData,
  contextData,
}: Props) {
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

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
        LinkToAvoidedKilometersImpact: () => (
          <a
            {...getDetailsLink({
              sectionName: "social.localPeopleOrCompany",
              impactDetailsName: "avoidedVehiculeKilometers",
            })}
            className={classNames("px-1", fr.cx("fr-btn", "fr-btn--tertiary-no-outline"))}
          >
            «&nbsp;🚙 Kilomètres évités&nbsp;»
          </a>
        ),
        LinkToTimeTravelSavedSocialImpact: () => (
          <Button
            {...getDetailsLink({
              sectionName: "social.localPeopleOrCompany",
              impactDetailsName: "timeTravelSavedInHours",
            })}
            className={classNames("px-1", fr.cx("fr-btn", "fr-btn--tertiary-no-outline"))}
            priority="tertiary no outline"
          >
            «&nbsp;⏱️ Temps passé en moins dans les transports&nbsp;»
          </Button>
        ),
        If,
      }}
    />
  );
}
