import { View } from "@react-pdf/renderer";

import type { ModalTableProps } from "../../../impact-description-modals/modal-table/ModalTable";
import { formatMonetaryImpactPdf } from "../../../project-impacts/pdf-export/format";
import { ModalPdfSimpleTd } from "./ModalPdfTd";
import { renderChildren } from "./helpers";
import { exportModalPdfStyles } from "./styles";

const getPositiveNegativeTextClassesFromValue = (value: number): string => {
  if (value === 0) {
    return "#161616";
  }
  return value > 0 ? "#19753C" : "#CE0500";
};

export const ModalPdfTableTdValue = (props: { value: number; label: string; isBold?: boolean }) => {
  return (
    <ModalPdfSimpleTd
      style={{
        textAlign: "right",
        fontWeight: props.isBold ? "bold" : "normal",
        color: getPositiveNegativeTextClassesFromValue(props.value),
      }}
    >
      {props.label}
    </ModalPdfSimpleTd>
  );
};

export const ModalPdfTdLegendSquare = (p: { color?: string }) => (
  <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: p.color }} />
);

export const ModalPdfTable = ({ data, formatFn = formatMonetaryImpactPdf }: ModalTableProps) => (
  <View wrap={false} style={{ ...exportModalPdfStyles.table, width: "49%" }}>
    <View>
      <View style={{ ...exportModalPdfStyles.row, textTransform: "uppercase", fontWeight: 700 }}>
        <ModalPdfSimpleTd style={{ backgroundColor: "#ddd", flexGrow: 3 }}>
          Gain ou perte
        </ModalPdfSimpleTd>
        <ModalPdfSimpleTd style={{ backgroundColor: "#ddd" }}>Montant</ModalPdfSimpleTd>
      </View>
    </View>
    <View>
      {data.map((row) => (
        <View key={row.label} style={exportModalPdfStyles.row} wrap={false}>
          <View
            style={{
              ...exportModalPdfStyles.cell,
              flexDirection: "row",
              gap: "6px",
              alignItems: "center",
              flexGrow: 3,
            }}
          >
            <ModalPdfTdLegendSquare color={row.color} />
            {renderChildren(row.label, exportModalPdfStyles.cellText, true)}
          </View>
          <ModalPdfTableTdValue value={row.value} label={formatFn(row.value)} />
        </View>
      ))}
    </View>
  </View>
);
