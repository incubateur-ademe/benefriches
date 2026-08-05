import { Suspense, useContext, useMemo } from "react";
import {
  ProjectDevelopmentEconomicBalanceItem,
  ProjectOperatingEconomicBalanceItem,
  sumListWithKey,
} from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import {
  EconomicBalanceDetailsImpactKeyName,
  EconomicBalanceImpactKeyName,
  EconomicBalanceMainImpactKeyName,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ImpactInProgressDescriptionModal from "@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { filterByName } from "@/shared/core/filter-by-name/filterByName";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getEconomicBalanceImpactLabel } from "../../getImpactLabel";
import ModalTable from "../shared/ModalTable";
import { LazyContent, LazyContentComponent } from "../shared/lazy-content/LazyContent";
import ModalColumnPointChart from "../shared/modal-charts/ModalColumnPointChart";
import EconomicBalanceDescription from "./EconomicBalanceDescription";
import { getEconomicBalanceImpactColor } from "./colors";

type Props = {
  impactName?: EconomicBalanceMainImpactKeyName;
  impactDetailsName?: EconomicBalanceDetailsImpactKeyName;
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
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
    name: EconomicBalanceDetailsImpactKeyName;
  }[];
};
const ECONOMIC_BALANCE_MODALS = {
  realEstateAcquisition: {
    title: "🏠 Transaction foncière",
    Component: () => import("./real_estate_acquisition.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = filterByName(
        impactsData.projectEconomicBalance.details,
        "sitePurchase",
        "buildingsResaleRevenue",
        "siteResaleRevenue",
      )?.map(({ name, total }) => ({
        label: getEconomicBalanceImpactLabel(`realEstateAcquisition.${name}`),
        color: getEconomicBalanceImpactColor(`realEstateAcquisition.${name}`),
        value: total,
        name: `realEstateAcquisition.${name}` as const,
      }));

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },

  "realEstateAcquisition.sitePurchase": {
    title: "🏠 Acquisition du site",
    Component: () => import("./real_estate_acquisition-site_purchase.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(impactsData, (item) => item.name === "sitePurchase"),
  },

  "realEstateAcquisition.siteResaleRevenue": {
    title: "🚪 Cession du site",
    Component: () => import("./real_estate_acquisition-site_resale.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(impactsData, (item) => item.name === "siteResaleRevenue"),
  },
  "realEstateAcquisition.buildingsResaleRevenue": undefined,

  siteReinstatement: {
    title: "🚧 Remise en état de la friche",
    Component: () => import("./site_reinstatement.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = impactsData.projectEconomicBalance.details
        .filter((item) => item.name === "siteReinstatement")
        ?.map(({ details, total }) => ({
          label: getEconomicBalanceImpactLabel(`siteReinstatement.${details}`),
          color: getEconomicBalanceImpactColor(`siteReinstatement.${details}`),
          value: total,
          name: `siteReinstatement.${details}` as const,
        }));

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },
  "siteReinstatement.sustainable_soils_reinstatement": {
    title: "🌱 Restauration écologique",
    Component: () => import("./site_reinstatement-sustainable_soils_reinstatement.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) =>
          item.name === "siteReinstatement" && item.details === "sustainable_soils_reinstatement",
      ),
  },
  "siteReinstatement.deimpermeabilization": {
    title: "🌧️ Désimperméabilisation",
    Component: () => import("./site_reinstatement-deimpermeabilization.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "deimpermeabilization",
      ),
  },
  "siteReinstatement.remediation": {
    title: "✨ Dépollution des sols",
    Component: () => import("./site_reinstatement-remediation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "remediation",
      ),
  },
  "siteReinstatement.demolition": {
    title: "🧱 Déconstruction",
    Component: () => import("./site_reinstatement-demolition.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "demolition",
      ),
  },
  "siteReinstatement.asbestos_removal": undefined,
  "siteReinstatement.waste_collection": {
    title: "♻️️ Évacuation et traitement des déchets",
    Component: () => import("./site_reinstatement-waste_collection.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "waste_collection",
      ),
  },
  "siteReinstatement.other_reinstatement": {
    title: "🏗️ Autres dépenses de remise en état",
    Component: () => import("./site_reinstatement-other_reinstatement.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "siteReinstatement" && item.details === "other_reinstatement",
      ),
  },

  photovoltaicProjectInstallation: {
    title: "⚡️ Installation de la centrale $EnR",
    Component: () => import("./photovoltaic_development_plan_installation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = impactsData.projectEconomicBalance.details
        .filter((item) => item.name === "projectInstallation")
        ?.map(({ details, total }) => ({
          label: getEconomicBalanceImpactLabel(`photovoltaicProjectInstallation.${details}`),
          color: getEconomicBalanceImpactColor(`photovoltaicProjectInstallation.${details}`),
          value: total,
          name: `photovoltaicProjectInstallation.${details}` as const,
        }));

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },
  "photovoltaicProjectInstallation.installation_works": {
    title: "🛠️ Travaux d'installation des panneaux",
    Component: () => import("./photovoltaic_development_plan_installation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "installation_works",
      ),
  },
  "photovoltaicProjectInstallation.technical_studies": {
    title: "📋 Études et honoraires techniques",
    Component: () => import("./photovoltaic_technical_studies.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "technical_studies",
      ),
  },
  "photovoltaicProjectInstallation.other": {
    title: "⚡️ Autres frais d’installation de la centrale",
    Component: () => import("./photovoltaic_other.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "other",
      ),
  },

  urbanProjectInstallation: {
    title: "🏘 Aménagement du site",
    Component: () => import("./urban_project_development_plan_installation.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = impactsData.projectEconomicBalance.details
        .filter((item) => item.name === "projectInstallation")
        ?.map(({ details, total }) => ({
          label: getEconomicBalanceImpactLabel(`urbanProjectInstallation.${details}`),
          color: getEconomicBalanceImpactColor(`urbanProjectInstallation.${details}`),
          value: total,
          name: `urbanProjectInstallation.${details}` as const,
        }));

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },
  "urbanProjectInstallation.development_works": {
    title: "🔌 Travaux d'aménagement (VRD, espaces verts...)",
    Component: () => import("./urban_project_works.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "development_works",
      ),
  },
  "urbanProjectInstallation.technical_studies": {
    title: "📋 Études et honoraires techniques",
    Component: () => import("./urban_project_technical_studies.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "technical_studies",
      ),
  },
  "urbanProjectInstallation.other": {
    title: "🏘 Autres dépenses d'aménagements",
    Component: () => import("./urban_project_other.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) => item.name === "projectInstallation" && item.details === "other",
      ),
  },

  projectBuildingsInstallation: undefined,
  "projectBuildingsInstallation.buildings_construction_works": undefined,
  "projectBuildingsInstallation.buildings_rehabilitation_works": undefined,
  "projectBuildingsInstallation.technical_studies_and_fees": undefined,
  "projectBuildingsInstallation.other_construction_expenses": undefined,

  financialAssistanceRevenues: {
    title: "🏦 Aides financière",
    Component: () => import("./financial_assistance.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]): EconomicBalanceModalData | undefined => {
      const details = impactsData.projectEconomicBalance.details
        .filter((item) => item.name === "financialAssistanceRevenues")
        ?.map(({ details, total }) => ({
          label: getEconomicBalanceImpactLabel(`financialAssistanceRevenues.${details}`),
          color: getEconomicBalanceImpactColor(`financialAssistanceRevenues.${details}`),
          value: total,
          name: `financialAssistanceRevenues.${details}` as const,
        }));

      return details
        ? {
            total: sumListWithKey(details, "value"),
            details,
          }
        : undefined;
    },
  },
  "financialAssistanceRevenues.public_subsidies": {
    title: "🏫 Subventions publiques",
    Component: () => import("./financial_assistance-public_subsidies.mdx"),
    getData: (impactsData: ModalDataProps["impactsData"]) =>
      getTotal(
        impactsData,
        (item) =>
          item.name === "financialAssistanceRevenues" && item.details === "public_subsidies",
      ),
  },
  "financialAssistanceRevenues.local_or_regional_authority_participation": {
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
  EconomicBalanceImpactKeyName,
  | {
      title: string;
      getData: (impactsData: ModalDataProps["impactsData"]) => EconomicBalanceModalData | undefined;
      Component: LazyContentComponent;
    }
  | undefined
>;

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
            ? getEconomicBalanceImpactLabel(impactDetailsName)
            : getEconomicBalanceImpactLabel(impactName)
        }
        breadcrumbProps={breadcrumbProps}
      />
    );
  }

  const { Component, title, getData } = config;
  const data = getData(impactsData);

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
            <LazyContent
              contextData={contextData}
              impactsData={impactsData}
              Component={Component}
            />
          </ModalContent>
        </ModalGrid>
      </ModalBody>
    </Suspense>
  );
}
