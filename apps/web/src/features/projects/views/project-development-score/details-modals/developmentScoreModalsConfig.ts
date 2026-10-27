import type { MDXComponents } from "mdx/types";
import { lazy, type LazyExoticComponent } from "react";
import { sumListWithKey, typedObjectEntries, type LetterGrade } from "shared";
import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";
import { findTotalByName } from "@/features/projects/core/group-impacts/findTotalByName";
import type { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import type { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";

import { serializeContentState } from "../../impact-description-modals/ImpactModalDescriptionContext";
import {
  getEnvironmentalImpactColor,
  getSocialImpactColor,
  getSocioEconomicImpactColor,
} from "../../impact-description-modals/colors";
import { getImpactModalData } from "../../impact-description-modals/getImpactData";
import type { ModalColumnPointChartProps } from "../../impact-description-modals/modal-charts/ModalColumnPointChart";
import type { ModalColumnSeriesChartProps } from "../../impact-description-modals/modal-charts/ModalColumnSeriesChart";
import type { ModalGroupTableProps } from "../../impact-description-modals/modal-table/ModalGroupTable";
import type { ModalTableProps } from "../../impact-description-modals/modal-table/ModalTable";
import type { ImpactAreaChartProps } from "../../shared/charts/useImpactAreaChartProps";
import {
  formatCO2Impact,
  formatETPImpact,
  formatMonetaryImpact,
} from "../../shared/formatImpactValue";
import {
  getEnvironmentalImpactLabel,
  getSocialImpactLabel,
  getSocioEconomicImpactLabel,
} from "../../shared/getImpactLabel";
import { LOCAL_AUTHORITY_IMPACTS_CATEGORIES } from "../../shared/impacts/impactGroupCategory";
import type { DetailsName } from "./useOpenDescriptionModalLink";

const FullTimeJobsMetrics = lazy(() => import("./metrics/FullTimeJobsMetrics"));

const ECOSYSTEM_SERVICES = [
  "newStoredCo2Eq",
  "natureRelatedWelnessAndLeisure",
  "forestRelatedProduct",
  "pollination",
  "invasiveSpeciesRegulation",
  "waterCycle",
  "nitrogenCycle",
  "soilErosion",
] as const;

export const DEVELOPMENT_SCORE_CONFIG_MODALS = {
  global: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/00-intro.mdx"),
    ),
    letterGrade: () => undefined,

    dataProps: () => undefined,
    MetricsComponent: null,
  },

  fullTimeJobsScore: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/02-emplois.mdx"),
    ),
    letterGrade: (d) => d.fullTimeJobsScore.score.letterGrade,
    dataProps: (p) => {
      const data = getImpactModalData<SocialImpactMetricKeyName>(
        p.modalsData.socialMetricsByCategory.jobs,
        "fullTimeJobs",
        {
          getLabel: getSocialImpactLabel,
          getColor: getSocialImpactColor,
          getLinkProps: (key) =>
            p.getUpdateDetailsLink(
              serializeContentState({ sectionName: "social.jobs", impactDetailsName: key }),
            ),
        },
      );
      if (!data?.breakdown || !data.details) {
        return undefined;
      }
      return {
        type: "area",
        chartProps: {
          type: "etp",
          base: data.breakdown?.base,
          forecast: data.breakdown.forecast,
          difference: data.total,
          title: getSocialImpactLabel("fullTimeJobs"),
          color: data.color,
          details: data?.details.map((item) => ({
            ...item,
            base: item.breakdown?.base ?? 0,
            forecast: item.breakdown?.forecast ?? item.value,
            difference: item.value,
          })),
        },
        tableProps: {
          formatFn: formatETPImpact,
          caption: "Détails des emplois temps plein créés, supprimés ou préservés",
          data: data?.details,
        },
      };
    },
    MetricsComponent: FullTimeJobsMetrics,
  },

  localPeopleQualityOfLifeScore: {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/index.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.score.letterGrade,
  },
  "localPeopleQualityOfLifeScore.livingEnvironment": {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/cadre-de-vie.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.livingEnvironment.letterGrade,
  },
  "localPeopleQualityOfLifeScore.localHealthiness": {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/sante.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.localHealthiness.letterGrade,
  },
  "localPeopleQualityOfLifeScore.accessToHealthCare": {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/acces-aux-soins.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.accessToHealthCare.letterGrade,
  },
  "localPeopleQualityOfLifeScore.accessToLocalServices": {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/acces-commerces-services.mdx"),
    ),
    letterGrade: (d) =>
      d.localPeopleQualityOfLifeScore.indicators.accessToLocalServices.letterGrade,
  },
  "localPeopleQualityOfLifeScore.frichesAccidents": {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/accidents-friche.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.fricheAccidents.letterGrade,
  },
  "localPeopleQualityOfLifeScore.trafficSecurity": {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/03-qualite-de-vie/securite-routiere.mdx"),
    ),
    letterGrade: (d) => d.localPeopleQualityOfLifeScore.indicators.trafficSecurity.letterGrade,
  },

  localAuthorityEconomicScore: {
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/01-finances-collectivite.mdx"),
    ),
    letterGrade: (d) => d.localAuthorityEconomicScore.score.letterGrade,
    dataProps: (p) => {
      const impacts = p.modalsData.economicImpactsByBearerAndCategory.localAuthority.impacts;

      const data = typedObjectEntries(
        Object.groupBy(impacts, (item) => {
          switch (item.keyName) {
            case "oldRentalIncomeLoss":
            case "projectedRentalIncome":
              return "rentalIncome";

            case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
            case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
              return "fricheCosts";

            case "previousSiteOperationBenefitLoss":
            case "projectOperatingExpenses":
            case "projectOperatingRevenues":
              return "operatingEconomicBalance";

            case "propertyTransferDutiesIncome":
            case "localTransferDutiesIncrease":
            case "taxesIncome":
              return "taxesIncome";

            case "waterRegulation":
            case "fricheRoadsAndUtilitiesExpenses":
              return "municipalityExpenses";
            default:
              return "other";
          }
        }),
      ).map(([category, items = []]) => ({
        label: category === "other" ? "Autres" : LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].label,
        total: sumListWithKey(items, "total"),
        values: items.map(({ keyName, total }) => ({
          name: keyName,
          value: total,
          label: getSocioEconomicImpactLabel(keyName),
          color: getSocioEconomicImpactColor(keyName),
          linkProps: p.getUpdateDetailsLink(
            serializeContentState({
              sectionName: "socioEconomic.localAuthority" as const,
              impactDetailsName: keyName,
            }),
          ),
        })),
      }));
      return {
        type: "groupedColumn",
        chartProps: {
          format: "monetary",
          exportTitle: "Impacts socio-économiques pour la collectivité",
          data: data,
        },
        tableProps: {
          formatFn: formatCO2Impact,
          caption: "Liste des impacts socio-économiques pour la collectivité",
          data: data,
        },
      };
    },
  },

  environmentScore: {
    dataProps: () => undefined,
    MetricsComponent: null,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/index.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.score.letterGrade,
  },
  "environmentScore.co2eqEmissionsVariation": {
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/co2eq.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.co2eqEmissionsVariation.letterGrade,
    dataProps: (p) => {
      const data = getImpactModalData<EnvironmentalImpactMetricKeyName>(
        p.modalsData.environmentalMetricsByCategory.co2eq,
        "avoidedCo2eqEmissions",
        {
          getLabel: getEnvironmentalImpactLabel,
          getColor: getEnvironmentalImpactColor,
          getLinkProps: (key) =>
            p.getUpdateDetailsLink(
              serializeContentState({
                sectionName: "environmental.co2eq",
                impactDetailsName: key,
              }),
            ),
        },
      );
      if (!data?.breakdown || !data.details) {
        return undefined;
      }
      return {
        type: "area",
        chartProps: {
          type: "co2",
          base: data.breakdown?.base,
          forecast: data.breakdown.forecast,
          difference: data.total,
          title: getSocialImpactLabel("fullTimeJobs"),
          color: data.color,
          details: data.details.map((item) => ({
            ...item,
            base: item.breakdown?.base ?? 0,
            forecast: item.breakdown?.forecast ?? item.value,
            difference: item.value,
          })),
        },
        tableProps: {
          formatFn: formatCO2Impact,
          caption: "Liste des émissions de Co2eq évitées",
          data: data.details,
        },
      };
    },
  },
  "environmentScore.ecosystemServices": {
    dataProps: (p) => {
      const { metrics } = p.developmentScore.details.environmentScore.indicators.ecosystemServices;

      const details = ECOSYSTEM_SERVICES.map((name) => ({
        label: getSocioEconomicImpactLabel(`ecosystemServices.${name}`),
        value: findTotalByName(metrics.ecosystemicServices, name),
        color: getSocioEconomicImpactColor(`ecosystemServices.${name}`),
        linkProps: p.getUpdateDetailsLink(
          serializeContentState({
            sectionName: "socioEconomic.humanity",
            impactDetailsName: `ecosystemServices.${name}`,
          }),
        ),
      })).toSorted((a, b) => b.value - a.value);

      return {
        type: "column",
        chartProps: {
          format: "monetary",
          data: details,
          exportTitle: getSocioEconomicImpactLabel("ecosystemServices"),
        },
        tableProps: {
          formatFn: formatMonetaryImpact,
          caption:
            "Liste des impacts écosystémiques pouvant être rendus par les sols et leur valeur pour le projet",
          data: details,
        },
      };
    },
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/services-ecosystemiques.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.ecosystemServices.letterGrade,
    MetricsComponent: null,
  },
  "environmentScore.soilsQuality": {
    dataProps: () => undefined,
    MetricsComponent: null,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/qualite-des-sols.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.soilsQuality.letterGrade,
  },
  "environmentScore.waterQuality": {
    dataProps: () => undefined,
    MetricsComponent: null,

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/qualite-de-l-eau.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.waterQuality.letterGrade,
  },
  "environmentScore.zanCompliance": {
    dataProps: () => undefined,
    MetricsComponent: null,
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/shared/impacts/documentation/content/07-score-impact/04-environnement/zan.mdx"),
    ),
    letterGrade: (d) => d.environmentScore.indicators.zanCompliance.letterGrade,
  },
} as const satisfies Record<
  DetailsName,
  {
    ContentComponent: ContentComponent;
    letterGrade: (details: LetterGradeInput) => LetterGrade | undefined;
    MetricsComponent: React.ComponentType<
      Pick<DevelopmentScoreDataView, "developmentScore">
    > | null;

    dataProps: (p: DataPropsInput) => DataProps;
  }
>;

type DataPropsInput = DevelopmentScoreDataView & {
  getUpdateDetailsLink: (details?: string) => Link;
};

type LetterGradeInput = DevelopmentScoreDataView["developmentScore"]["details"];

export type ContentComponent = LazyExoticComponent<ContentComponentType>;
export type DataProps =
  | {
      type: "area";
      chartProps: ImpactAreaChartProps;
      tableProps: ModalTableProps;
    }
  | {
      type: "column";
      chartProps: ModalColumnPointChartProps;
      tableProps: ModalTableProps;
    }
  | {
      type: "groupedColumn";
      chartProps: ModalColumnSeriesChartProps;
      tableProps: ModalGroupTableProps;
    }
  | undefined;

type ContentComponentType = React.ComponentType<{
  components?: MDXComponents;
}>;
