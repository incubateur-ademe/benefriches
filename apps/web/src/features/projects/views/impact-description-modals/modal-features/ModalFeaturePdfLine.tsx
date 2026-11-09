import { View } from "@react-pdf/renderer";
import type { ComponentProps, ReactNode } from "react";

import { renderChildren } from "../../project-development-score/details-modals/export/helpers";

type DataLineProps = {
  label: ReactNode;
  isTotal?: boolean;
  value: ReactNode;
  style?: ComponentProps<typeof View>["style"];
};
function ModalFeaturePdfLine({ label, value, isTotal, style }: DataLineProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: isTotal ? "bold" : "normal",
      }}
    >
      {renderChildren(label, [
        {
          fontWeight: isTotal ? "bold" : "normal",
          textTransform: isTotal ? "uppercase" : undefined,
          paddingHorizontal: 8,
          paddingVertical: 4,
        },
        style,
      ])}
      {renderChildren(value, [
        {
          textAlign: "right",
          backgroundColor: "#f6f6f6",
          width: "33%",
          paddingHorizontal: 8,
          paddingVertical: 4,
        },
        style,
      ])}
    </View>
  );
}

export default ModalFeaturePdfLine;
