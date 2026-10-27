import { View } from "@react-pdf/renderer";

import type { ModalGroupTableProps } from "../../../impact-description-modals/modal-table/ModalGroupTable";
import { formatMonetaryImpactPdf } from "../../../project-impacts/pdf-export/format";
import { ModalPdfTableTdValue, ModalPdfTdLegendSquare } from "./ModalPdfTable";
import { ModalPdfSimpleTd } from "./ModalPdfTd";
import { renderChildren } from "./helpers";
import { exportModalPdfStyles } from "./styles";

export const ModalPdfGroupTable = ({
  data,
  formatFn = formatMonetaryImpactPdf,
}: ModalGroupTableProps) => (
  <View wrap={false} style={{ ...exportModalPdfStyles.table, width: "45%" }}>
    <View>
      <View style={{ ...exportModalPdfStyles.row, textTransform: "uppercase", fontWeight: 700 }}>
        <ModalPdfSimpleTd style={{ backgroundColor: "#ddd", flexGrow: 3 }}>
          Gain ou perte
        </ModalPdfSimpleTd>
        <ModalPdfSimpleTd style={{ backgroundColor: "#ddd" }}>Montant</ModalPdfSimpleTd>
      </View>
    </View>
    <View>
      {data.flatMap(({ values, label, total }) => [
        <View
          key={label}
          style={{ ...exportModalPdfStyles.row, backgroundColor: "#ddd", fontWeight: 700 }}
        >
          <ModalPdfSimpleTd style={{ textTransform: "uppercase", flexGrow: 3 }}>
            {label}
          </ModalPdfSimpleTd>
          <ModalPdfTableTdValue isBold value={total} label={formatFn(total)} />
        </View>,
        values.map((row) => (
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
        )),
      ])}
    </View>
  </View>
);
