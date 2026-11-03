import { View, Image as PdfImage } from "@react-pdf/renderer";

import type { ModalHeaderDataProps } from "../../../impact-description-modals/modal-layout/ModalHeader";
import { ModalPdfGroupTable } from "./ModalPdfGroupTable";
import { ModalPdfTable } from "./ModalPdfTable";

export const ModalPdfData = (props: {
  dataProps: ModalHeaderDataProps;
  chartImage: string | undefined;
}) => {
  return (
    <View
      style={{
        display: "flex",
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {props.chartImage && (
        <PdfImage src={props.chartImage} style={{ width: "49%", marginVertical: 12 }} />
      )}
      {props.dataProps?.type === "groupedColumn" ? (
        <ModalPdfGroupTable {...props.dataProps.tableProps} />
      ) : props.dataProps?.type !== "value" ? (
        <ModalPdfTable {...props.dataProps.tableProps} />
      ) : null}
    </View>
  );
};
