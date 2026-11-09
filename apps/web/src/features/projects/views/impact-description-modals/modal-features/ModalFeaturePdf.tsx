import { View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const ModalFeaturePdf = ({ children }: { children: ReactNode }) => {
  return (
    <View
      wrap={false}
      style={{
        maxWidth: "66%",
        fontSize: 12,
        marginVertical: 4,
        border: "1px solid #333333",
        borderRadius: 4,
      }}
    >
      {children}
    </View>
  );
};

export default ModalFeaturePdf;
