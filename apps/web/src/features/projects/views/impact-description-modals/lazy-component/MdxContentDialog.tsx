import { fr } from "@codegouvfr/react-dsfr";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { Dialog, DialogPanel } from "@headlessui/react";
import type { MDXComponents } from "mdx/types";
import {
  type ComponentProps,
  type LazyExoticComponent,
  type ReactNode,
  Suspense,
  useLayoutEffect,
  useMemo,
} from "react";
import type { Link, Route } from "type-route";

import { type routes } from "@/app/router";
import { type embedRoutes } from "@/embed";
import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { commonMdxComponents } from "../../shared/impacts/documentation/mdxComponents";
import type { UpdateModalContentArgs } from "../ImpactModalDescriptionContext";
import type { ContentComponentType } from "../config-wizard/config.type";
import ModalProjectFeature from "../modal-features/ModalProjectFeature";
import ModalSiteFeature from "../modal-features/ModalSiteFeature";
import ModalBody from "../modal-layout/ModalBody";
import ModalGrid from "../modal-layout/ModalGrid";
import type { ModalHeaderProps } from "../modal-layout/ModalHeader";
import ModalHeader from "../modal-layout/ModalHeader";
import useToggleDescriptionModal from "../useToggleDescriptionModal";

type Props<TRoute extends SupportedRoute> = Pick<
  ModalHeaderProps,
  "breadcrumbSegments" | "dataProps"
> & {
  modalsData: ModalDataProps;
  dialogId?: string;
  ContentComponent: LazyExoticComponent<ContentComponentType>;
  disableExport?: boolean;
  mdxComponents?: MDXComponents;
  route: TRoute;
  getRouteFn: (params: TRoute["params"]) => { link: Link; push: () => void };
};

const DIALOG_ID = "impact-modal-description";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

function bindProps<P extends object, K extends keyof P>(
  Component: React.ComponentType<P>,
  boundProps: Pick<P, K>,
) {
  return (props: Omit<P, K>) => <Component {...(boundProps as P)} {...(props as P)} />;
}

const impactsDialogMdxComponents: MDXComponents = {
  ...commonMdxComponents,
  h2: ({ children }: ComponentProps<"h2">) => <h2 className="text-lg my-4">{children}</h2>,
  h3: ({ children }: ComponentProps<"h3">) => <h2 className="text-base my-3">{children}</h2>,
  If: ({ when, children }: { when: boolean; children: React.ReactNode }) =>
    when ? children : null,
};

const ModalLink = ({
  children,
  state,
  getLink,
}: {
  getLink: (state: UpdateModalContentArgs) => Link | undefined;
  children: ReactNode;
  state: UpdateModalContentArgs;
}) => (
  <a
    {...getLink(state)}
    className={classNames("px-1", fr.cx("fr-btn", "fr-btn--tertiary-no-outline"))}
  >
    {children}
  </a>
);

type SupportedRoute =
  | Route<typeof routes.projectImpactsDevelopmentScore>
  | Route<typeof routes.projectImpactsBreakEvenLevel>
  | Route<typeof routes.projectImpacts>
  | Route<typeof embedRoutes.routes.quickImpactsUrbanProject>;

export default function <TRoute extends SupportedRoute>({
  modalsData,
  ContentComponent,
  dialogId = DIALOG_ID,
  dataProps,
  breadcrumbSegments,
  mdxComponents,
  route,
  getRouteFn,
  disableExport,
}: Props<TRoute>) {
  const { isDark } = useIsDark();

  const { contextData, impactsData } = modalsData;

  const isOpen = Boolean(route.params.details);

  const { getDetailsLink, handleClose, onCloseLink, contentState } = useToggleDescriptionModal({
    route,
    getRouteFn,
  });

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

  const siteContaminatedSurfaceArea =
    impactsData.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
      (item) => item.name === "contaminatedSurface",
    )?.total;

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

  const dialogTitleId = `${dialogId}-title`;

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${dialogId} .fr-modal__body`);

    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContentComponent, dialogId]);

  if (!ContentComponent) {
    return null;
  }

  return (
    <Dialog id={DIALOG_ID} open={isOpen} onClose={handleClose} aria-labelledby={dialogTitleId}>
      <div className={classNames(DIALOG_DSFR_CSS, isDark ? "highcharts-dark" : "highcharts-light")}>
        <DialogPanel>
          <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
            <ModalBody size="large">
              <ModalGrid>
                <div
                  className={classNames(
                    "px-6 md:px-10 pt-0 pb-10 mb-0 [&>h2:first-of-type]:pt-4",
                    fr.cx("fr-modal__content"),
                    "bg-(--background-alt-grey)",
                  )}
                >
                  <ContentComponent
                    withMonetarisation={
                      contentState.sectionName?.startsWith("economicBalance") ||
                      contentState.sectionName?.startsWith("socioEconomic")
                    }
                    isUrban={contextData.projectDevelopmentPlan.type === "URBAN_PROJECT"}
                    isPhotovoltaic={
                      contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                    }
                    components={{
                      ...impactsDialogMdxComponents,
                      h1: (props) => (
                        <ModalHeader
                          dialogTitleId={dialogTitleId}
                          onCloseLink={onCloseLink}
                          exportProps={
                            !dataProps || disableExport
                              ? false
                              : {
                                  ContentComponent: ContentComponent,
                                  projectName: contextData.projectName,
                                }
                          }
                          dataProps={dataProps}
                          breadcrumbSegments={breadcrumbSegments}
                          {...props}
                        />
                      ),
                      SiteFeature: BoundSiteFeature,
                      ProjectFeature: BoundProjectFeature,
                      ModalLink: ({
                        children,
                        state,
                      }: {
                        children: ReactNode;
                        state: UpdateModalContentArgs;
                      }) => (
                        <ModalLink getLink={getDetailsLink} state={state}>
                          {children}
                        </ModalLink>
                      ),
                      LinkToAvoidedKilometersImpact: () => (
                        <ModalLink
                          getLink={getDetailsLink}

                          state={{
                            sectionName: "social.localPeopleOrCompany",
                            impactDetailsName: "avoidedVehiculeKilometers",
                          }}
                        >
                          «&nbsp;🚙 Kilomètres évités&nbsp;»
                        </ModalLink>
                      ),
                      LinkToTimeTravelSavedSocialImpact: () => (
                        <ModalLink
                          getLink={getDetailsLink}
                          state={{
                            sectionName: "social.localPeopleOrCompany",
                            impactDetailsName: "timeTravelSavedInHours",
                          }}
                        >
                          «&nbsp;⏱️ Temps passé en moins dans les transports&nbsp;»
                        </ModalLink>
                      ),
                      ...mdxComponents,
                    }}
                  />
                </div>
              </ModalGrid>
            </ModalBody>
          </Suspense>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
