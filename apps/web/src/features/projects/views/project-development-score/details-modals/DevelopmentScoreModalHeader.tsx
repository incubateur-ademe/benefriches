import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { type HighchartsReact } from "highcharts-react-official";
import { useRef, type LazyExoticComponent, type ReactNode } from "react";
import type { LetterGrade } from "shared";
import type { Link } from "type-route";

import classNames from "@/shared/views/clsx";

import type { ContentComponentType } from "../../impact-description-modals/config-wizard/config.type";
import ModalAreaChart from "../../impact-description-modals/modal-charts/ModalAreaChart";
import ModalColumnPointChart from "../../impact-description-modals/modal-charts/ModalColumnPointChart";
import ModalColumnSeriesChart from "../../impact-description-modals/modal-charts/ModalColumnSeriesChart";
import { extractEmoji } from "../../impact-description-modals/modal-charts/modalBarChartValueFormat";
import ModalData from "../../impact-description-modals/modal-layout/ModalData";
import ModalGroupTable from "../../impact-description-modals/modal-table/ModalGroupTable";
import ModalTable from "../../impact-description-modals/modal-table/ModalTable";
import { textOf } from "../../shared/impacts/documentation/mdxHelpers";
import GradeTextBadge from "../layout/ProjectDevelopmentScoreGradeTextBadge";
import { getLetterGradeBadgeText } from "../layout/gradeLabels";
import type { DataProps } from "./developmentScoreModalsConfig";
import { downloadBlobAsPDF, getExportPdfModalDocumentAsBlob } from "./export/helpers";
import type { DetailsName } from "./useOpenDescriptionModalLink";

export const DIALOG_TITLE_ID = "developmentScore-modal-description-title";

const downloadModalAsPDF = async (props: {
  chartRef?: React.RefObject<HighchartsReact.RefObject | null>;
  dataProps: DataProps;
  headerProps: { badgeText?: string; letterGrade?: LetterGrade };
  ContentComponent: LazyExoticComponent<ContentComponentType>;
  fileName: string;
  projectName: string;
}) => {
  const blob = await getExportPdfModalDocumentAsBlob(props);

  downloadBlobAsPDF(blob, props.fileName);
};

export default ({
  children,
  onCloseLink,
  detailsName,
  letterGrade,
  ContentComponent,
  dataProps,
  projectName,
}: {
  letterGrade?: LetterGrade;
  children?: ReactNode;
  onCloseLink: Link;
  detailsName: DetailsName;
  ContentComponent: LazyExoticComponent<ContentComponentType>;
  dataProps: DataProps;
  projectName: string;
}) => {
  const badgeKind = (() => {
    switch (detailsName) {
      case "environmentScore.co2eqEmissionsVariation":
      case "fullTimeJobsScore":
        return "evolution";
      case "localAuthorityEconomicScore":
        return "impact";
      case "environmentScore.zanCompliance":
        return "compliance";
      default:
        return "qualitative";
    }
  })();

  const title = textOf(children);
  const titleWithoutEmoji = title.replace(extractEmoji(title) ?? "", "");
  const chartRef = useRef(null);

  return (
    <>
      <div className="flex justify-end items-start gap-2">
        {detailsName !== "global" &&
          detailsName !== "environmentScore" &&
          detailsName !== "localPeopleQualityOfLifeScore" && (
            <Button
              iconId="fr-icon-file-download-line"
              size="small"
              onClick={async (event) => {
                event.stopPropagation();
                void downloadModalAsPDF({
                  chartRef,
                  ContentComponent,
                  dataProps,
                  headerProps: {
                    letterGrade: letterGrade,
                    badgeText: letterGrade && getLetterGradeBadgeText(badgeKind, letterGrade),
                  },
                  fileName: `${projectName} - ${titleWithoutEmoji}`,
                  projectName: projectName,
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
      <div className="inline-flex justify-between items-center gap-4 mb-7">
        <h1 id={DIALOG_TITLE_ID} className={classNames(fr.cx("fr-modal__title"), "mb-0")}>
          {children}
        </h1>

        {letterGrade && (
          <GradeTextBadge
            letterGrade={letterGrade}
            badgeText={getLetterGradeBadgeText(badgeKind, letterGrade)}
          />
        )}
      </div>
      {dataProps ? (
        <ModalData noPadding>
          {dataProps.type === "column" && (
            <ModalColumnPointChart {...dataProps.chartProps} chartProps={{ ref: chartRef }} />
          )}
          {dataProps.type === "groupedColumn" && (
            <ModalColumnSeriesChart {...dataProps.chartProps} ref={chartRef} />
          )}

          {dataProps.type === "area" && (
            <ModalAreaChart {...dataProps.chartProps} chartProps={{ ref: chartRef }} />
          )}

          {dataProps.type === "groupedColumn" ? (
            <ModalGroupTable {...dataProps.tableProps} />
          ) : (
            <ModalTable {...dataProps.tableProps} />
          )}
        </ModalData>
      ) : null}
    </>
  );
};
