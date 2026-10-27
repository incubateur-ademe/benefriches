import { Document, Page, Text, View, Image as PdfImage } from "@react-pdf/renderer";
import { type ComponentProps } from "react";
import type { LetterGrade } from "shared";

import { type ContentComponent, type DataProps } from "../developmentScoreModalsConfig";
import { ModalPdfData } from "./ModalPdfData";
import { extractGradeColor } from "./helpers";
import { pdfComponents, pdfHeading } from "./mdxComponents";
import { exportModalPdfStyles } from "./styles";

const PdfLetterBadgeText = (props: { badgeText?: string; letterGrade?: LetterGrade }) => {
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
        marginBottom: 12,
        backgroundColor: extractGradeColor(props.letterGrade, "bgColor"),
        color: extractGradeColor(props.letterGrade, "textColor"),
      }}
    >
      {props.badgeText}
    </Text>
  );
};

export const ModalPdfDocument = (props: {
  ContentComponent: ContentComponent;
  chartImage: string | undefined;
  dataProps: DataProps;
  headerProps: { badgeText?: string; letterGrade?: LetterGrade };
  projectName: string;
}) => (
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
          <Text style={exportModalPdfStyles.headerText}>{props.projectName}</Text>
        </View>

        <PdfImage src="/img/logos/logo-ademe.png" style={{ height: 28 }} />
      </View>
      <View>
        <props.ContentComponent
          components={{
            Metrics: () => null,
            ...pdfComponents,
            h1: (p: ComponentProps<"h1">) => {
              return (
                <View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    {pdfHeading("h1")(p)}
                    <PdfLetterBadgeText {...props.headerProps} />
                  </View>

                  <ModalPdfData {...props} />
                </View>
              );
            },
          }}
        />
      </View>
    </Page>
  </Document>
);
