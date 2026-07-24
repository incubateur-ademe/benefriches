import type { MDXComponents } from "mdx/types";
import { lazy, Suspense, useContext, useMemo } from "react";
import {
  ProjectDevelopmentEconomicBalanceItem,
  ProjectOperatingEconomicBalanceItem,
  sumListWithKey,
} from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import {
  EconomicBalanceDetailsName,
  EconomicBalanceMainName,
  getDevelopmentPlanDetailsName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ImpactInProgressDescriptionModal from "@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import ModalTable from "../shared/ModalTable";
import ModalColumnPointChart from "../shared/modal-charts/ModalColumnPointChart";
import EconomicBalanceDescription from "./EconomicBalanceDescription";
import ModalSiteOrProjectFeature from "./EconomicBalanceModalSiteOrProjectFeature";

type Props = {
  impactName?: EconomicBalanceMainName;
  impactDetailsName?: EconomicBalanceDetailsName;
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
};

const getEconomicBalanceDetailsColor = (impactName: EconomicBalanceDetailsName) => {
  switch (impactName) {
    case "asbestos_removal":
      return "#F4C00A";
    case "deimpermeabilization":
      return "#039CF2";
    case "demolition":
      return "#85341B";
    case "other_reinstatement":
      return "#DE3317";
    case "remediation":
      return "#F6DB1F";
    case "sustainable_soils_reinstatement":
      return "#7ACA17";
    case "waste_collection":
      return "#298435";

    case "photovoltaic_works":
      return "#7E7F81";
    case "photovoltaic_technical_studies":
      return "#C4C5C6";
    case "photovoltaic_other":
      return "#FF9700";

    case "urban_project_works":
      return "#9E89CC";
    case "urban_project_technical_studies":
      return "#C4C5C6";
    case "urban_project_other":
      return "#E9DABE";

    case "local_or_regional_authority_participation":
      return "#1D5DA2";
    case "public_subsidies":
      return "#AFF6FF";
    case "other":
      return "#FFADFE";
    default:
      return "";
  }
};

const getTotal = (
  impactsData: ModalDataProps["impactsData"],
  filterFn: (
    item: ProjectDevelopmentEconomicBalanceItem | ProjectOperatingEconomicBalanceItem,
  ) => boolean,
): EconomicBalanceModalData | undefined => {
  const filtered = impactsData.projectEconomicBalance.details.filter(filterFn);
  return filtered.length > 0 ? { total: sumListWithKey(filtered, "total") } : undefined;
};

type EconomicBalanceModalData = {
  total: number;
  details?: {
    label: string;
    color: string;
    value: number;
    name: EconomicBalanceDetailsName;
  }[];
};
const ECONOMIC_BALANCE_MODALS = {
  site_purchase: {
    title: "🏠 Acquisition du site",
    Component: () => import("./site_purchase.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(impactsData, (item) => item.name === "sitePurchase"),
  },

  site_resale: {
    title: "🚪 Cession du site",
    Component: () => import("./site_resale.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(impactsData, (item) => item.name === "siteResaleRevenue"),
  },
  buildings_resale: undefined,

  site_reinstatement: {
    title: "🚧 Remise en état de la friche",
    Component: () => import("./site_reinstatement.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = impactsData.projectEconomicBalance.details
        .filter((item) => item.name === "siteReinstatement")
        ?.map(({ details, total }) => ({
          label: getEconomicBalanceDetailsImpactLabel("site_reinstatement", details),
          color: getEconomicBalanceDetailsColor(details),
          value: total,
          name: details,
        }));

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },
  sustainable_soils_reinstatement: {
    title: "🌱 Restauration écologique",
    Component: () => import("./site_reinstatement-sustainable_soils_reinstatement.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) =>
          item.name === "siteReinstatement" && item.details === "sustainable_soils_reinstatement",
      ),
  },
  deimpermeabilization: {
    title: "🌧️ Désimperméabilisation",
    Component: () => import("./site_reinstatement-deimpermeabilization.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "deimpermeabilization",
      ),
  },
  remediation: {
    title: "✨ Dépollution des sols",
    Component: () => import("./site_reinstatement-remediation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "remediation",
      ),
  },
  demolition: {
    title: "🧱 Déconstruction",
    Component: () => import("./site_reinstatement-demolition.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "demolition",
      ),
  },
  asbestos_removal: undefined,
  waste_collection: {
    title: "♻️️ Évacuation et traitement des déchets",
    Component: () => import("./site_reinstatement-waste_collection.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "waste_collection",
      ),
  },
  other_reinstatement: {
    title: "🏗️ Autres dépenses de remise en état",
    Component: () => import("./site_reinstatement-other_reinstatement.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "other_reinstatement",
      ),
  },

  photovoltaic_development_plan_installation: {
    title: "⚡️ Installation de la centrale $EnR",
    Component: () => import("./photovoltaic_development_plan_installation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = impactsData.projectEconomicBalance.details
        .filter((item) => item.name === "projectInstallation")
        ?.map(({ details, total }) => {
          const name = getDevelopmentPlanDetailsName(
            details,
            "PHOTOVOLTAIC_POWER_PLANT",
          ) as EconomicBalanceDetailsName;
          return {
            label: getEconomicBalanceDetailsImpactLabel(
              "photovoltaic_development_plan_installation",
              details,
            ),
            color: getEconomicBalanceDetailsColor(name),
            value: total,
            name: name,
          };
        });

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },
  photovoltaic_works: {
    title: "🛠️ Travaux d'installation des panneaux",
    Component: () => import("./photovoltaic_development_plan_installation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "installation_works",
      ),
  },
  photovoltaic_technical_studies: {
    title: "📋 Études et honoraires techniques",
    Component: () => import("./photovoltaic_technical_studies.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "technical_studies",
      ),
  },
  photovoltaic_other: {
    title: "⚡️ Autres frais d’installation de la centrale",
    Component: () => import("./photovoltaic_other.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "other",
      ),
  },

  urban_project_development_plan_installation: {
    title: "🏘 Aménagement du site",
    Component: () => import("./urban_project_development_plan_installation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = impactsData.projectEconomicBalance.details
        .filter((item) => item.name === "projectInstallation")
        ?.map(({ details, total }) => {
          const name = getDevelopmentPlanDetailsName(
            details,
            "URBAN_PROJECT",
          ) as EconomicBalanceDetailsName;
          return {
            label: getEconomicBalanceDetailsImpactLabel(
              "urban_project_development_plan_installation",
              details,
            ),
            color: getEconomicBalanceDetailsColor(name),
            value: total,
            name: name,
          };
        });

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },
  urban_project_works: {
    title: "🔌 Travaux d'aménagement (VRD, espaces verts...)",
    Component: () => import("./urban_project_works.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "development_works",
      ),
  },
  urban_project_technical_studies: {
    title: "📋 Études et honoraires techniques",
    Component: () => import("./urban_project_technical_studies.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "technical_studies",
      ),
  },
  urban_project_other: {
    title: "🏘 Autres dépenses d'aménagements",
    Component: () => import("./urban_project_other.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "other",
      ),
  },

  urban_project_buildings_construction_and_rehabilitation: undefined,
  buildings_construction_works: undefined,
  buildings_rehabilitation_works: undefined,
  other_construction_expenses: undefined,

  financial_assistance: {
    title: "🏦 Aides financière",
    Component: () => import("./financial_assistance.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = impactsData.projectEconomicBalance.details
        .filter((item) => item.name === "financialAssistanceRevenues")
        ?.map(({ details, total }) => ({
          label: getEconomicBalanceDetailsImpactLabel("financial_assistance", details),
          color: getEconomicBalanceDetailsColor(details),
          value: total,
          name: details,
        }));

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },
  public_subsidies: {
    title: "🏫 Subventions publiques",
    Component: () => import("./financial_assistance-public_subsidies.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) =>
          item.name === "financialAssistanceRevenues" && item.details === "public_subsidies",
      ),
  },
  local_or_regional_authority_participation: {
    title: "🏦 Participation des collectivités",
    Component: () => import("./financial_assistance-local_or_regional_authority_participation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) =>
          item.name === "financialAssistanceRevenues" &&
          item.details === "local_or_regional_authority_participation",
      ),
  },

  operations_costs: undefined,
  operations_revenues: undefined,
  rent: undefined,
  maintenance: undefined,
  taxes: undefined,
  other: undefined,
  operations: undefined,

  development_plan_installation: undefined,
  technical_studies: undefined,
  installation_works: undefined,
  development_works: undefined,
  technical_studies_and_fees: undefined,
} as const satisfies Record<
  EconomicBalanceMainName | EconomicBalanceDetailsName,
  | {
      title: string;
      getData: (impactsData: ModalDataProps["impactsData"]) => EconomicBalanceModalData | undefined;
      Component: () => Promise<{
        default: React.ComponentType<{ components?: MDXComponents } & Record<string, unknown>>;
      }>;
    }
  | undefined
>;

function bindProps<P extends object, K extends keyof P>(
  Component: React.ComponentType<P>,
  boundProps: Pick<P, K>,
) {
  return (props: Omit<P, K>) => <Component {...(boundProps as P)} {...(props as P)} />;
}

export function EconomicBalanceModalWizard({
  impactName,
  impactDetailsName,
  impactsData,
  contextData,
}: Props) {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const breadcrumbProps = {
    section: {
      label: "Bilan de l'opération",
      contentState: { sectionName: "economic_balance" as const },
    },
    segments:
      impactDetailsName && impactName
        ? [
            {
              label: getEconomicBalanceImpactLabel(impactName),
              contentState: {
                sectionName: "economic_balance" as const,
                impactName,
              },
            },
          ]
        : [],
  };

  const config = useMemo(() => {
    return impactName ? ECONOMIC_BALANCE_MODALS[impactDetailsName ?? impactName] : undefined;
  }, [impactName, impactDetailsName]);

  const BoundSiteFeature = useMemo(
    () =>
      bindProps(ModalSiteOrProjectFeature, {
        siteSurfaceArea: contextData.siteSurfaceArea,
        soilsDistribution:
          impactsData.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.filter(
            (item) => item.name === "soilsDistribution",
          ),
      }),
    [contextData, impactsData],
  );
  const BoundProjectFeature = useMemo(
    () =>
      bindProps(ModalSiteOrProjectFeature, {
        soilsDistribution:
          impactsData.reconversionImpactsBreakdown.projectIndirectImpactMetrics.filter(
            (item) => item.name === "soilsDistribution",
          ),
      }),
    [impactsData],
  );

  if (!impactName) {
    return (
      <EconomicBalanceDescription
        impactsData={impactsData}
        projectType={contextData.projectDevelopmentPlan.type}
      />
    );
  }

  if (!config) {
    return (
      <ImpactInProgressDescriptionModal
        title={
          impactDetailsName
            ? getEconomicBalanceDetailsImpactLabel(impactName, impactDetailsName)
            : getEconomicBalanceImpactLabel(impactName)
        }
        breadcrumbProps={breadcrumbProps}
      />
    );
  }

  const { Component, title, getData } = config;
  const data = getData(impactsData);
  const LazyComponent = lazy(Component);

  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      <ModalBody size="large">
        <ModalHeader
          title={title}
          value={
            data?.total
              ? {
                  state: data?.total > 0 ? "success" : "error",
                  text: formatMonetaryImpact(data?.total),
                  description: `pour ${impactsData.stakeholders.project.developer.structureName ?? "l'aménageur"}`,
                }
              : undefined
          }
          breadcrumbSegments={[
            breadcrumbProps.section,
            ...breadcrumbProps.segments,
            { label: title },
          ]}
        />
        <ModalGrid>
          {data?.details && (
            <ModalData>
              <ModalColumnPointChart format="monetary" data={data.details} exportTitle={title} />

              <ModalTable
                caption={`Liste détaillée des dépenses et recettes de ${title}`}
                data={data.details.map(({ label, value, color, name }) => ({
                  label,
                  value,
                  color,
                  onClick: () => {
                    updateModalContent({
                      sectionName: "economic_balance",
                      impactName: impactName,
                      impactDetailsName: name,
                    });
                  },
                }))}
              />
            </ModalData>
          )}
          <ModalContent>
            <LazyComponent
              components={{
                a: ExternalLink,
                h2: ModalTitleTwo,
                h3: ModalTitleThree,
                SiteFeature: BoundSiteFeature,
                ProjectFeature: BoundProjectFeature,
              }}
            />
          </ModalContent>
        </ModalGrid>
      </ModalBody>
    </Suspense>
  );
}
