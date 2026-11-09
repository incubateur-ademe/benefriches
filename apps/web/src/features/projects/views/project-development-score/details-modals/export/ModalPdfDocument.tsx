import { Document, Page, Text, View, Image as PdfImage } from "@react-pdf/renderer";
import type { MDXComponents } from "mdx/types";
import { type ReactNode, type ComponentProps, useState } from "react";
import type { LetterGrade } from "shared";

import { type ModalHeaderProps } from "../../../impact-description-modals/modal-layout/ModalHeader";
import {
  replaceNonBreakingSpacePdf,
  replaceSquareMetersHtmlSymbolPdf,
} from "../../../pdf-impacts-export/pdf-export/format";
import { LETTER_GRADE_BADGE_TEXT, type ScoreBadgeLabelKind } from "../../layout/gradeLabels";
import { type ContentComponent } from "../developmentScoreModalsConfig";
import { ModalPdfData } from "./ModalPdfData";
import { extractGradeColor, renderChildren } from "./helpers";
import { pdfComponents, pdfHeading } from "./mdxComponents";
import { exportModalPdfStyles } from "./styles";

const PdfLetterBadgeText = (props: {
  badgeKind?: ScoreBadgeLabelKind;
  letterGrade?: LetterGrade;
}) => {
  if (!props.letterGrade) {
    return null;
  }
  return (
    <Text
      style={{
        borderRadius: 8,
        fontSize: 9,
        paddingHorizontal: 6,
        paddingVertical: 3,
        fontWeight: 700,
        display: "flex",
        backgroundColor: extractGradeColor(props.letterGrade, "bgColor"),
        color: extractGradeColor(props.letterGrade, "textColor"),
      }}
    >
      {LETTER_GRADE_BADGE_TEXT[props.badgeKind ?? "qualitative"][props.letterGrade]}
    </Text>
  );
};

const PdfHeader = ({
  dataProps,
  chartImage,
  ...rest
}: {
  dataProps?: ModalHeaderProps["dataProps"];
  chartImage: string | undefined;
} & ComponentProps<"h1">) => {
  return (
    <View>
      <View
        style={{
          marginBottom: 12,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: 4,
          }}
        >
          {pdfHeading("h1", { marginBottom: 0 })(rest)}
          <PdfLetterBadgeText {...dataProps?.headerProps.score} />
        </View>
        {dataProps?.headerProps.subtitle && (
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>{dataProps.headerProps.subtitle}</Text>
        )}
        {dataProps?.headerProps.value && (
          <View
            style={{
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: dataProps?.headerProps.value.state === "success" ? "#19753C" : "#CE0500",
              }}
            >
              {replaceSquareMetersHtmlSymbolPdf(
                replaceNonBreakingSpacePdf(dataProps?.headerProps.value.text),
              )}
            </Text>

            {dataProps?.headerProps.value.description && (
              <Text style={{ color: "#333" }}>{dataProps?.headerProps.value.description}</Text>
            )}
          </View>
        )}
      </View>
      {dataProps && <ModalPdfData chartImage={chartImage} dataProps={dataProps} />}
    </View>
  );
};

export const ModalPdfDocument = (props: {
  ContentComponent: ContentComponent;
  chartImage: string | undefined;
  dataProps?: ModalHeaderProps["dataProps"];
  projectName: string;
  mdxComponents?: MDXComponents;
}) => {
  const [currentDate] = useState(() => new Date().toLocaleDateString("fr-FR"));

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={exportModalPdfStyles.page}>
        <View fixed style={exportModalPdfStyles.header}>
          <View
            style={{
              display: "flex",
              gap: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <PdfImage src="/img/logos/logo-benefriches.png" style={{ height: 16 }} />
            <Text style={exportModalPdfStyles.headerText}>
              Évaluation des impacts du projet « {props.projectName} »
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              gap: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={exportModalPdfStyles.headerText}>Résultats du {currentDate}</Text>
            <PdfImage src="/img/logos/logo-ademe.png" style={{ height: 28 }} />
          </View>
        </View>
        <View>
          <props.ContentComponent
            components={{
              Metrics: () => null,
              SiteFeature: () => null,
              ProjectFeature: () => null,
              ...props.mdxComponents,
              ...pdfComponents,
              ModalLink: (p: { children: ReactNode }) => renderChildren(p.children, [], true),
              h1: (p: ComponentProps<"h1">) => (
                <PdfHeader dataProps={props.dataProps} chartImage={props.chartImage} {...p} />
              ),
              If: ({ when, children }: { when: boolean; children: React.ReactNode }) =>
                when ? renderChildren(children) : null,
            }}
          />
        </View>
      </Page>
    </Document>
  );
};
