import { Font, Text } from "@react-pdf/renderer";
import type { View } from "@react-pdf/renderer";
import { type HighchartsReact } from "highcharts-react-official";
import { Children, type ComponentProps, type LazyExoticComponent, type ReactNode } from "react";
import type { LetterGrade } from "shared";

import { buildChartSvg } from "@/shared/views/components/Charts/buildChartSvgFromRef";

import type { ContentComponentType } from "../../../impact-description-modals/config-wizard/config.type";
import { LETTER_GRADE_COLORS } from "../../layout/colors";
import type { DataProps } from "../developmentScoreModalsConfig";
import { ModalPdfDocument } from "./ModalPdfDocument";

const isTextual = (c: ReactNode): c is string | number =>
  typeof c === "string" || typeof c === "number";

export const HEX_REGEX = /^[a-z-]+-\[(#[0-9a-fA-F]{3,8})\]$/;

export const extractGradeColor = (
  letterGrade: LetterGrade,
  props: "bgColor" | "textColor" | "bgLightColor",
) => HEX_REGEX.exec(LETTER_GRADE_COLORS[letterGrade][props])?.[1];

const NARROW_NBSP = /\u202f/g;

const fixSpaces = (text: string) => text.replace(NARROW_NBSP, "\u00a0");

export type Style = ComponentProps<typeof View>["style"];

export const renderChildren = (children: ReactNode, style?: Style, inline = false) => {
  const items = Children.toArray(children).map((item) =>
    typeof item === "string" ? fixSpaces(item) : item,
  );
  if (items.length === 0) return null;

  if (inline || items.every(isTextual)) {
    return <Text style={style}>{items}</Text>;
  }

  return (
    <>
      {items.map((item, i) => {
        if (!isTextual(item)) return item;
        if (typeof item === "string" && !item.trim()) return null;
        return (
          <Text key={i} style={style}>
            {item}
          </Text>
        );
      })}
    </>
  );
};

Font.register({
  family: "Marianne",
  fonts: [
    { src: "/dsfr/fonts/Marianne-Regular.woff", fontWeight: 400 },
    { src: "/dsfr/fonts/Marianne-Regular_Italic.woff", fontWeight: 400, fontStyle: "italic" },
    { src: "/dsfr/fonts/Marianne-Medium.woff", fontWeight: 500 },
    { src: "/dsfr/fonts/Marianne-Medium_Italic.woff", fontWeight: 500, fontStyle: "italic" },
    { src: "/dsfr/fonts/Marianne-Bold.woff", fontWeight: 700 },
    { src: "/dsfr/fonts/Marianne-Bold_Italic.woff", fontWeight: 700, fontStyle: "italic" },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

Font.registerEmojiSource({
  format: "png",
  url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
});

const svgToPngDataUrl = (svg: string, width: number, height: number, scale = 3) =>
  new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas indisponible"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    });
    img.addEventListener("error", reject);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });

const convertChartToDataUrl = async (
  chartRef?: React.RefObject<HighchartsReact.RefObject | null>,
) => {
  if (chartRef) {
    const chart = chartRef.current?.chart;
    const svg = await buildChartSvg({
      chartRef: chartRef,
      exportConfig: {
        ...chart?.options.exporting,
        chartOptions: {
          ...chart?.options.exporting?.chartOptions,
          title: { text: "" },
        },
      },
    });
    if (chart && svg) {
      return svgToPngDataUrl(svg, chart.chartWidth, chart.chartHeight);
    }
  }
  return undefined;
};

export const getExportPdfModalDocumentAsBlob = async (props: {
  chartRef?: React.RefObject<HighchartsReact.RefObject | null>;
  ContentComponent: LazyExoticComponent<ContentComponentType>;
  dataProps: DataProps;
  headerProps: { badgeText?: string; letterGrade?: LetterGrade };
  projectName: string;
}) => {
  const chartImage = await convertChartToDataUrl(props.chartRef);

  const { pdf } = await import("@react-pdf/renderer");

  return pdf(<ModalPdfDocument {...props} chartImage={chartImage} />).toBlob();
};

export const downloadBlobAsPDF = (blob: Blob, exportName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = exportName;
  a.click();

  URL.revokeObjectURL(url);
};
