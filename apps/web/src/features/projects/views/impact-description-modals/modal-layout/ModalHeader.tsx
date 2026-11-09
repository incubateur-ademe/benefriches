import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { type HighchartsReact } from "highcharts-react-official";
import type { MDXComponents } from "mdx/types";
import {
  cloneElement,
  type ReactElement,
  type RefObject,
  useRef,
  type LazyExoticComponent,
  type ReactNode,
} from "react";
import type { LetterGrade } from "shared";
import type { Link } from "type-route";

import classNames from "@/shared/views/clsx";

import type { ContentComponentType } from "../../impact-description-modals/config-wizard/config.type";
import ModalAreaChart from "../../impact-description-modals/modal-charts/ModalAreaChart";
import ModalColumnPointChart, {
  type ModalColumnPointChartProps,
} from "../../impact-description-modals/modal-charts/ModalColumnPointChart";
import ModalColumnSeriesChart, {
  type ModalColumnSeriesChartProps,
} from "../../impact-description-modals/modal-charts/ModalColumnSeriesChart";
import { extractEmoji } from "../../impact-description-modals/modal-charts/modalBarChartValueFormat";
import ModalData from "../../impact-description-modals/modal-layout/ModalData";
import ModalGroupTable, {
  type ModalGroupTableProps,
} from "../../impact-description-modals/modal-table/ModalGroupTable";
import ModalTable, {
  type ModalTableProps,
} from "../../impact-description-modals/modal-table/ModalTable";
import {
  downloadBlobAsPDF,
  getExportPdfModalDocumentAsBlob,
} from "../../project-development-score/details-modals/export/helpers";
import GradeTextBadge from "../../project-development-score/layout/ProjectDevelopmentScoreGradeTextBadge";
import {
  getLetterGradeBadgeText,
  type ScoreBadgeLabelKind,
} from "../../project-development-score/layout/gradeLabels";
import type { ImpactAreaChartProps } from "../../shared/charts/useImpactAreaChartProps";
import { textOf } from "../../shared/impacts/documentation/mdxHelpers";
import ModalBreadcrumb, { type BreadcrumbProps } from "./ModalBreadcrumb";

export const DIALOG_TITLE_ID = "developmentScore-modal-description-title";

const downloadModalAsPDF = async (props: {
  chartRef?: React.RefObject<HighchartsReact.RefObject | null>;
  dataProps: ModalHeaderProps["dataProps"];
  ContentComponent: LazyExoticComponent<ContentComponentType>;
  fileName: string;
  projectName: string;
  mdxComponents?: MDXComponents;
}) => {
  const blob = await getExportPdfModalDocumentAsBlob(props);

  downloadBlobAsPDF(blob, props.fileName);
};

type HeaderProps = {
  subtitle?: ReactNode;
  score?: { letterGrade: LetterGrade; labelKind: ScoreBadgeLabelKind };
  value?: {
    state: "success" | "error";
    text: string;
    description?: string;
  };
};

export type ModalHeaderDataProps =
  | {
      type: "area";
      chartProps: ImpactAreaChartProps;
      tableProps: ModalTableProps;
      headerProps: HeaderProps;
    }
  | {
      type: "column";
      chartProps: ModalColumnPointChartProps;
      tableProps: ModalTableProps;
      headerProps: HeaderProps;
    }
  | {
      type: "groupedColumn";
      chartProps: ModalColumnSeriesChartProps;
      tableProps: ModalGroupTableProps;
      headerProps: HeaderProps;
    }
  | {
      type: "value";
      headerProps: HeaderProps;
    }
  | {
      type: "custom";
      chart: ReactElement<{ ref?: RefObject<HighchartsReact.RefObject | null> | undefined }>;
      tableProps: ModalTableProps;
      headerProps: HeaderProps;
    };

export type ModalHeaderProps = {
  children?: ReactNode;
  onCloseLink: Link;
  breadcrumbSegments?: BreadcrumbProps["segments"];
  dataProps?: ModalHeaderDataProps;

  exportProps:
    | {
        ContentComponent: LazyExoticComponent<ContentComponentType>;
        projectName: string;
        mdxComponents?: MDXComponents;
      }
    | false;
};

export default ({
  children,
  onCloseLink,
  exportProps,
  dataProps,
  breadcrumbSegments,
}: ModalHeaderProps) => {
  const title = textOf(children);
  const titleWithoutEmoji = title.replace(extractEmoji(title) ?? "", "");
  const chartRef = useRef(null);

  return (
    <div className="bg-white dark:bg-black -mx-6 md:-mx-10">
      <div className="border-0 border-solid border-b border-border-grey w-full p-6">
        <div
          className={classNames(
            "flex justify-between items-start",
            breadcrumbSegments ? "justify-between" : "justify-end",
          )}
        >
          {breadcrumbSegments && <ModalBreadcrumb segments={breadcrumbSegments} />}
          <div className="flex justify-around gap-2">
            {exportProps && (
              <Button
                iconId="fr-icon-file-download-line"
                size="small"
                onClick={async (event) => {
                  event.stopPropagation();
                  void downloadModalAsPDF({
                    chartRef,
                    ContentComponent: exportProps.ContentComponent,
                    mdxComponents: exportProps.mdxComponents,
                    dataProps,
                    fileName: `${exportProps.projectName} - ${titleWithoutEmoji}`,
                    projectName: exportProps.projectName,
                  });
                }}
              >
                Télécharger
              </Button>
            )}
            <a
              className={fr.cx("fr-btn--tertiary-no-outline", "fr-btn--sm", "fr-btn")}
              {...onCloseLink}
              type="button"
            >
              Fermer
            </a>
          </div>
        </div>
        <div className="mb-2">
          <h1
            id={DIALOG_TITLE_ID}
            className={classNames(
              fr.cx("fr-modal__title"),
              "mb-0",
              "inline-flex justify-between items-center gap-4",
            )}
          >
            {children}
            {dataProps?.headerProps.score?.letterGrade && (
              <GradeTextBadge
                letterGrade={dataProps?.headerProps.score.letterGrade}
                badgeText={getLetterGradeBadgeText(
                  dataProps?.headerProps.score.labelKind,
                  dataProps?.headerProps.score?.letterGrade,
                )}
              />
            )}
          </h1>
          {dataProps?.headerProps.subtitle && (
            <div className="font-bold mt-2">{dataProps.headerProps.subtitle}</div>
          )}
        </div>

        {dataProps?.headerProps.value && (
          <div>
            <span
              className={classNames(
                "text-2xl",
                "font-bold",
                dataProps?.headerProps.value.state === "success"
                  ? "text-success-ultradark dark:text-success-ultralight"
                  : "text-error-ultradark dark:text-error-ultralight",
              )}
            >
              {dataProps?.headerProps.value.text}
            </span>

            {dataProps?.headerProps.value.description && (
              <span className="text-text-light">{` ${dataProps?.headerProps.value.description}`}</span>
            )}
          </div>
        )}
      </div>
      {dataProps && dataProps?.type !== "value" ? (
        <ModalData>
          {dataProps.type === "column" && (
            <ModalColumnPointChart {...dataProps.chartProps} chartProps={{ ref: chartRef }} />
          )}
          {dataProps.type === "groupedColumn" && (
            <ModalColumnSeriesChart {...dataProps.chartProps} ref={chartRef} />
          )}

          {dataProps.type === "area" && (
            <ModalAreaChart {...dataProps.chartProps} chartProps={{ ref: chartRef }} />
          )}
          {dataProps.type === "custom" &&
            dataProps.chart &&
            cloneElement(dataProps.chart, { ref: chartRef })}

          {dataProps.type === "groupedColumn" ? (
            <ModalGroupTable {...dataProps.tableProps} />
          ) : (
            <ModalTable {...dataProps.tableProps} />
          )}
        </ModalData>
      ) : null}
    </div>
  );
};
