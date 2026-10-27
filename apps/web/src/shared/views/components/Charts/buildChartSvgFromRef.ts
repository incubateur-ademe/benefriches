import { type HighchartsReact } from "highcharts-react-official";

const fontToBase64 = async (url: string) => {
  const buffer = await (await fetch(url)).arrayBuffer();
  let binary = "";
  new Uint8Array(buffer).forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const injectFont = async (svgDoc: globalThis.Document) => {
  const base64 = await fontToBase64("/dsfr/fonts/Marianne-Regular.woff2"); // fichier dans /public/fonts
  const style = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
    @font-face {
      font-family: 'Marianne';
      src: url(data:font/woff2;base64,${base64}) format('woff2');
    }
    text, tspan { font-family: 'Marianne', sans-serif !important; }
  `;
  svgDoc.documentElement.prepend(style);
};

export const buildChartSvg = async ({
  chartRef,
  exportConfig,
  colors,
  colorBySeries,
}: {
  chartRef: React.RefObject<HighchartsReact.RefObject | null>;
  exportConfig: Highcharts.ExportingOptions;
  colors?: (string | undefined)[];
  colorBySeries?: boolean;
}) => {
  if (!chartRef.current) return null;

  const svgChart = new DOMParser().parseFromString(
    chartRef.current.chart.getSVG(exportConfig.chartOptions),
    "image/svg+xml",
  );

  /** Handle custom colors **/
  if (colorBySeries) {
    colors?.forEach((color, colorIndex) => {
      if (!color) {
        return;
      }
      const area = svgChart.querySelector<HTMLElement>(
        `.highcharts-series.highcharts-series-${colorIndex}.highcharts-color-${colorIndex} .highcharts-area`,
      );
      if (!area) {
        return;
      }
      area.style.setProperty(`stroke`, color);
      area.style.setProperty(`fill`, color);
    });
  } else {
    svgChart.querySelectorAll<HTMLElement>(`.highcharts-point`).forEach((elem, elemIndex) => {
      elem.style.setProperty(`stroke`, "#ffffff");
      if (!colors?.[elemIndex]) {
        return;
      }
      elem.style.setProperty(`fill`, colors[elemIndex]);
    });

    svgChart
      .querySelectorAll<HTMLElement>(`.highcharts-data-label-connector`)
      .forEach((elem, elemIndex) => {
        if (!colors?.[elemIndex]) {
          return;
        }
        elem.style.setProperty(`stroke`, colors[elemIndex]);
      });
  }
  /** Handle custom colors **/

  await injectFont(svgChart);

  return svgChart.documentElement.outerHTML;
};
