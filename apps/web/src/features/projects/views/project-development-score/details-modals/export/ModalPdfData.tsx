import { View, Image as PdfImage } from "@react-pdf/renderer";

import type { DataProps } from "../developmentScoreModalsConfig";
import { ModalPdfGroupTable } from "./ModalPdfGroupTable";
import { ModalPdfTable } from "./ModalPdfTable";

export const ModalPdfData = (props: { dataProps: DataProps; chartImage: string | undefined }) => {
  return (
    <View
      style={{
        display: "flex",
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {props.chartImage && (
        <PdfImage src={props.chartImage} style={{ width: "49%", marginVertical: 12 }} />
      )}
      {props.dataProps?.type === "groupedColumn" ? (
        <ModalPdfGroupTable {...props.dataProps.tableProps} />
      ) : props.dataProps?.type ? (
        <ModalPdfTable {...props.dataProps.tableProps} />
      ) : null}
    </View>
  );
};
